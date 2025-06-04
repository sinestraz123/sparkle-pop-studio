
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface NewsItem {
  id: string;
  title: string;
  description?: string;
  content?: string;
  image_url?: string;
  status: 'draft' | 'published';
  category?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useNews = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: newsItems,
    isLoading,
    error
  } = useQuery({
    queryKey: ['news-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as NewsItem[];
    },
  });

  const createNewsMutation = useMutation({
    mutationFn: async (newsData: Partial<NewsItem>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('news_items')
        .insert([{ ...newsData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news-items'] });
      toast({
        title: "Success",
        description: "News item created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create news item",
        variant: "destructive",
      });
      console.error('Error creating news item:', error);
    },
  });

  const updateNewsMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<NewsItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('news_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news-items'] });
      toast({
        title: "Success",
        description: "News item updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update news item",
        variant: "destructive",
      });
      console.error('Error updating news item:', error);
    },
  });

  const deleteNewsMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('news_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news-items'] });
      toast({
        title: "Success",
        description: "News item deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete news item",
        variant: "destructive",
      });
      console.error('Error deleting news item:', error);
    },
  });

  return {
    newsItems: newsItems || [],
    isLoading,
    error,
    createNews: createNewsMutation.mutate,
    updateNews: updateNewsMutation.mutate,
    deleteNews: deleteNewsMutation.mutate,
    isCreating: createNewsMutation.isPending,
    isUpdating: updateNewsMutation.isPending,
    isDeleting: deleteNewsMutation.isPending,
  };
};
