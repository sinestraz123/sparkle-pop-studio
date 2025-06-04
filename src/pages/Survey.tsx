
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SurveyBuilder } from '@/components/SurveyBuilder';
import { useSurveys, SurveyWithQuestions } from '@/hooks/useSurveys';
import { useToast } from '@/hooks/use-toast';

export default function Survey() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateSurvey, isUpdating } = useSurveys();
  const { toast } = useToast();

  const { data: survey, isLoading } = useQuery({
    queryKey: ['survey', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('surveys')
        .select(`
          *,
          survey_questions (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as SurveyWithQuestions;
    },
    enabled: !!id,
  });

  const handleSave = async (formData: any) => {
    try {
      if (id && survey) {
        // Update existing survey
        updateSurvey({
          id: survey.id,
          title: formData.title,
          description: formData.description,
          type: formData.type,
          position: formData.position,
          background_color: formData.background_color,
          text_color: formData.text_color,
          button_color: formData.button_color,
          submit_button_text: formData.submit_button_text,
          show_close_button: formData.show_close_button,
          auto_show: formData.auto_show,
          delay: formData.delay,
          status: formData.status,
        });

        // Update questions
        // Delete existing questions
        if (survey.survey_questions) {
          for (const question of survey.survey_questions) {
            await supabase
              .from('survey_questions')
              .delete()
              .eq('id', question.id);
          }
        }

        // Insert new questions
        for (let i = 0; i < formData.questions.length; i++) {
          const question = formData.questions[i];
          await supabase
            .from('survey_questions')
            .insert({
              survey_id: survey.id,
              question_text: question.question_text,
              question_type: question.question_type,
              options: question.options || null,
              required: question.required,
              order_index: i,
            });
        }

        toast({
          title: 'Survey updated',
          description: 'Your survey has been updated successfully.',
        });
      }
    } catch (error) {
      console.error('Error saving survey:', error);
      toast({
        title: 'Error',
        description: 'Failed to save survey. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <SurveyBuilder
      survey={survey || undefined}
      onSave={handleSave}
      onBack={handleBack}
      isLoading={isUpdating}
    />
  );
}
