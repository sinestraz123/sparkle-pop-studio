
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useSurveyQuestions = (surveyId: string) => {
  const queryClient = useQueryClient();

  const addQuestion = useMutation({
    mutationFn: async (question: any) => {
      const { data, error } = await supabase
        .from('survey_questions')
        .insert(question)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['survey-questions', surveyId] });
      toast.success('Question added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add question');
      console.error('Error adding question:', error);
    },
  });

  const deleteQuestion = useMutation({
    mutationFn: async (questionId: string) => {
      const { error } = await supabase
        .from('survey_questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['survey-questions', surveyId] });
      toast.success('Question deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete question');
      console.error('Error deleting question:', error);
    },
  });

  const updateQuestion = useMutation({
    mutationFn: async ({ questionId, updates }: { questionId: string; updates: any }) => {
      const { data, error } = await supabase
        .from('survey_questions')
        .update(updates)
        .eq('id', questionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['survey-questions', surveyId] });
      toast.success('Question updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update question');
      console.error('Error updating question:', error);
    },
  });

  return {
    addQuestion: addQuestion.mutate,
    deleteQuestion: deleteQuestion.mutate,
    updateQuestion: updateQuestion.mutate,
    isAdding: addQuestion.isPending,
    isDeleting: deleteQuestion.isPending,
    isUpdating: updateQuestion.isPending,
  };
};
