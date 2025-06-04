
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useSurveys = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: surveys, isLoading } = useQuery({
    queryKey: ['surveys'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createSurvey = useMutation({
    mutationFn: async (title: string) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('surveys')
        .insert({
          title,
          user_id: user.id,
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      toast.success('Survey created successfully');
      navigate(`/surveys/${data.id}`);
    },
    onError: (error) => {
      toast.error('Failed to create survey');
      console.error('Error creating survey:', error);
    },
  });

  const deleteSurvey = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('surveys')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      toast.success('Survey deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete survey');
      console.error('Error deleting survey:', error);
    },
  });

  return {
    surveys: surveys || [],
    isLoading,
    createSurvey: createSurvey.mutate,
    deleteSurvey: deleteSurvey.mutate,
    isCreating: createSurvey.isPending,
  };
};

export const useSurvey = (id: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: survey, isLoading } = useQuery({
    queryKey: ['survey', id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user && !!id,
  });

  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ['survey-questions', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('survey_questions')
        .select('*')
        .eq('survey_id', id)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const updateSurvey = useMutation({
    mutationFn: async (updates: any) => {
      const { data, error } = await supabase
        .from('surveys')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['survey', id] });
      toast.success('Survey updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update survey');
      console.error('Error updating survey:', error);
    },
  });

  return {
    survey,
    questions: questions || [],
    isLoading: isLoading || questionsLoading,
    updateSurvey: updateSurvey.mutate,
    isUpdating: updateSurvey.isPending,
  };
};
