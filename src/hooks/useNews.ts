
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const useNews = (newsId?: string) => {
  const [newsItem, setNewsItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('useNews effect triggered with newsId:', newsId, 'user:', user?.id);
    if (newsId && user) {
      fetchNewsItem();
    } else if (!newsId) {
      setLoading(false);
    }
  }, [newsId, user?.id]);

  const fetchNewsItem = async () => {
    if (!newsId || !user) {
      console.log('Cannot fetch news item - missing newsId or user');
      return;
    }

    console.log('Fetching news item with ID:', newsId);
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .eq('id', newsId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching news item:', error);
        throw error;
      }
      
      console.log('Fetched news item:', data);
      setNewsItem(data);
    } catch (error) {
      console.error('Error fetching news item:', error);
      toast({
        title: "Error",
        description: "Failed to load news item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNews = async (newsData: any) => {
    if (!user) {
      console.log('Cannot create news - no user');
      return;
    }

    console.log('Creating news with data:', newsData);
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('news_items')
        .insert({
          ...newsData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating news item:', error);
        throw error;
      }

      console.log('Created news item:', data);
      toast({
        title: "Success",
        description: "News item created successfully",
      });

      navigate(`/news/${data.id}`);
      return data;
    } catch (error) {
      console.error('Error creating news item:', error);
      toast({
        title: "Error",
        description: "Failed to create news item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateNews = async (id: string, newsData: any) => {
    if (!user) {
      console.log('Cannot update news - no user');
      return;
    }

    console.log('Updating news with ID:', id, 'data:', newsData);
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('news_items')
        .update(newsData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating news item:', error);
        throw error;
      }

      console.log('Updated news item:', data);
      setNewsItem(data);
      toast({
        title: "Success",
        description: "News item updated successfully",
      });

      return data;
    } catch (error) {
      console.error('Error updating news item:', error);
      toast({
        title: "Error",
        description: "Failed to update news item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteNews = async (id: string) => {
    if (!user) {
      console.log('Cannot delete news - no user');
      return;
    }

    console.log('Deleting news with ID:', id);
    setLoading(true);
    try {
      const { error } = await supabase
        .from('news_items')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting news item:', error);
        throw error;
      }

      console.log('Deleted news item successfully');
      toast({
        title: "Success",
        description: "News item deleted successfully",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting news item:', error);
      toast({
        title: "Error",
        description: "Failed to delete news item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    newsItem,
    loading,
    createNews,
    updateNews,
    deleteNews,
  };
};
