
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Spotlight {
  id: string;
  user_id: string;
  title: string;
  video_url: string;
  status: string;
  views: number;
  clicks: number;
  created_at: string;
  updated_at: string;
}

export const useSpotlights = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const spotlightsQuery = useQuery({
    queryKey: ['spotlights'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('spotlights')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching spotlights:', error);
        throw error;
      }

      return data as Spotlight[];
    },
    enabled: !!user,
  });

  const createSpotlight = useMutation({
    mutationFn: async (spotlightData: Partial<Spotlight>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('spotlights')
        .insert({
          ...spotlightData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spotlights'] });
      toast({
        title: 'Success',
        description: 'Spotlight created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create spotlight',
        variant: 'destructive',
      });
    },
  });

  const updateSpotlight = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Spotlight> & { id: string }) => {
      const { data, error } = await supabase
        .from('spotlights')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spotlights'] });
      toast({
        title: 'Success',
        description: 'Spotlight updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update spotlight',
        variant: 'destructive',
      });
    },
  });

  const deleteSpotlight = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('spotlights')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spotlights'] });
      toast({
        title: 'Success',
        description: 'Spotlight deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete spotlight',
        variant: 'destructive',
      });
    },
  });

  return {
    spotlights: spotlightsQuery.data || [],
    isLoading: spotlightsQuery.isLoading,
    error: spotlightsQuery.error,
    createSpotlight: createSpotlight.mutate,
    updateSpotlight: updateSpotlight.mutate,
    deleteSpotlight: deleteSpotlight.mutate,
    isCreating: createSpotlight.isPending,
    isUpdating: updateSpotlight.isPending,
    isDeleting: deleteSpotlight.isPending,
  };
};

export const useSpotlight = (id?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['spotlight', id],
    queryFn: async () => {
      if (!id || !user) return null;

      const { data, error } = await supabase
        .from('spotlights')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return data as Spotlight;
    },
    enabled: !!id && !!user,
  });
};
