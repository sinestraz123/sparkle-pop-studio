
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SurveyQuestion } from '@/types/survey';

export const useSurveyQuestionsManager = (surveyId?: string) => {
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
