
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Survey = Tables<'surveys'>;
type SurveyQuestion = Tables<'survey_questions'>;
type SurveyInsert = TablesInsert<'surveys'>;
type SurveyUpdate = TablesUpdate<'surveys'>;

export interface SurveyWithQuestions extends Survey {
  survey_questions: SurveyQuestion[];
}

export const useSurveys = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: surveys = [], isLoading, error } = useQuery({
    queryKey: ['surveys', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('surveys')
        .select(`
          *,
          survey_questions (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SurveyWithQuestions[];
    },
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async (survey: Omit<SurveyInsert, 'user_id'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('surveys')
        .insert({ ...survey, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & SurveyUpdate) => {
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
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // First delete all survey questions
      await supabase
        .from('survey_questions')
        .delete()
        .eq('survey_id', id);

      // Then delete the survey
      const { error } = await supabase
        .from('surveys')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
    },
  });

  return {
    surveys,
    isLoading,
    error,
    createSurvey: createMutation.mutate,
    updateSurvey: updateMutation.mutate,
    deleteSurvey: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
