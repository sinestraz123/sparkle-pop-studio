
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Survey {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: string;
  background_color: string;
  text_color: string;
  button_color: string;
  position: string;
  type: string;
  trigger_type: string;
  auto_show: boolean;
  delay: number;
  show_close_button: boolean;
  show_progress: boolean;
  views: number;
  responses: number;
  created_at: string;
  updated_at: string;
}

interface SurveyQuestion {
  id: string;
  survey_id: string;
  question_text: string;
  question_type: string;
  options?: any;
  required: boolean;
  order_index: number;
}

export const useSurveys = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: surveys, isLoading } = useQuery({
    queryKey: ['surveys'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Survey[];
    },
    enabled: !!user,
  });

  const createSurveyMutation = useMutation({
    mutationFn: async (surveyData: Partial<Survey>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('surveys')
        .insert({ ...surveyData, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      toast({
        title: "Success",
        description: "Survey created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating survey:', error);
      toast({
        title: "Error",
        description: "Failed to create survey",
        variant: "destructive",
      });
    },
  });

  const updateSurveyMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Survey> & { id: string }) => {
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
    onError: (error) => {
      console.error('Error updating survey:', error);
      toast({
        title: "Error",
        description: "Failed to update survey",
        variant: "destructive",
      });
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
      toast({
        title: "Success",
        description: "Survey deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting survey:', error);
      toast({
        title: "Error",
        description: "Failed to delete survey",
        variant: "destructive",
      });
    },
  });

  return {
    surveys,
    isLoading,
    createSurvey: createSurveyMutation.mutateAsync,
    updateSurvey: updateSurveyMutation.mutateAsync,
    deleteSurvey: deleteSurvey.mutate,
  };
};

export const useSurvey = (id?: string) => {
  const { data: survey, isLoading } = useQuery({
    queryKey: ['survey', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Survey;
    },
    enabled: !!id,
  });

  return { survey, loading: isLoading };
};

export const useSurveyQuestions = (surveyId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: questions, isLoading } = useQuery({
    queryKey: ['survey-questions', surveyId],
    queryFn: async () => {
      if (!surveyId) return [];

      const { data, error } = await supabase
        .from('survey_questions')
        .select('*')
        .eq('survey_id', surveyId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data as SurveyQuestion[];
    },
    enabled: !!surveyId,
  });

  const updateSurveyQuestions = async (surveyId: string, questions: Omit<SurveyQuestion, 'id' | 'survey_id'>[]) => {
    try {
      // Delete existing questions
      await supabase
        .from('survey_questions')
        .delete()
        .eq('survey_id', surveyId);

      // Insert new questions
      const questionsToInsert = questions.map((question, index) => ({
        ...question,
        survey_id: surveyId,
        order_index: index,
      }));

      const { error } = await supabase
        .from('survey_questions')
        .insert(questionsToInsert);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['survey-questions', surveyId] });
    } catch (error) {
      console.error('Error updating survey questions:', error);
      toast({
        title: "Error",
        description: "Failed to update survey questions",
        variant: "destructive",
      });
    }
  };

  return {
    questions,
    isLoading,
    updateSurveyQuestions,
  };
};
