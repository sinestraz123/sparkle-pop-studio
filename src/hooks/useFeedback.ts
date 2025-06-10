
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { FeedbackConfig } from '@/components/FeedbackBuilder';

export const useFeedback = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: feedbacks = [], isLoading, error } = useQuery({
    queryKey: ['feedbacks', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('feedback_widgets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(item => ({
        id: item.id,
        steps: item.steps as any, // Type assertion for Json to FeedbackStep[]
        backgroundColor: item.background_color,
        textColor: item.text_color,
        buttonColor: item.button_color,
        position: item.position,
        showCloseButton: item.show_close_button,
        isActive: item.status === 'active',
      })) as FeedbackConfig[];
    },
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async (feedback: Omit<FeedbackConfig, 'id'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('feedback_widgets')
        .insert({
          user_id: user.id,
          steps: feedback.steps as any, // Type assertion for FeedbackStep[] to Json
          background_color: feedback.backgroundColor,
          text_color: feedback.textColor,
          button_color: feedback.buttonColor,
          position: feedback.position,
          show_close_button: feedback.showCloseButton,
          status: feedback.isActive ? 'active' : 'draft',
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        steps: data.steps as any,
        backgroundColor: data.background_color,
        textColor: data.text_color,
        buttonColor: data.button_color,
        position: data.position,
        showCloseButton: data.show_close_button,
        isActive: data.status === 'active',
      } as FeedbackConfig;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
      toast({
        title: "Success",
        description: "Feedback widget created successfully",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<FeedbackConfig>) => {
      const updateData: any = {};
      if (updates.steps) updateData.steps = updates.steps;
      if (updates.backgroundColor) updateData.background_color = updates.backgroundColor;
      if (updates.textColor) updateData.text_color = updates.textColor;
      if (updates.buttonColor) updateData.button_color = updates.buttonColor;
      if (updates.position) updateData.position = updates.position;
      if (updates.showCloseButton !== undefined) updateData.show_close_button = updates.showCloseButton;
      if (updates.isActive !== undefined) updateData.status = updates.isActive ? 'active' : 'draft';

      const { data, error } = await supabase
        .from('feedback_widgets')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('feedback_widgets')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
      toast({
        title: "Success",
        description: "Feedback widget deleted successfully",
      });
    },
  });

  const createFeedback = (): Omit<FeedbackConfig, 'id'> => {
    return {
      steps: [
        {
          id: 'step1',
          type: 'nps',
          question: 'How likely are you to recommend us to a friend?',
          required: true,
        }
      ],
      backgroundColor: '#2563eb',
      textColor: '#ffffff',
      buttonColor: '#ffffff',
      position: 'bottom-center',
      showCloseButton: true,
      isActive: false,
    };
  };

  const addFeedback = () => {
    const newFeedback = createFeedback();
    createMutation.mutate(newFeedback);
  };

  const updateFeedback = (feedbackId: string, updates: Partial<FeedbackConfig>) => {
    updateMutation.mutate({ id: feedbackId, ...updates });
  };

  const deleteFeedback = (feedbackId: string) => {
    deleteMutation.mutate(feedbackId);
  };

  return {
    feedbacks,
    isLoading,
    error,
    addFeedback,
    updateFeedback,
    deleteFeedback,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
