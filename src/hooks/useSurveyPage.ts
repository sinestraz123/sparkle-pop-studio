
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useSurvey, useSurveys, useSurveyQuestions } from '@/hooks/useSurveys';

export const useSurveyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { survey, loading } = useSurvey(id);
  const { createSurvey, updateSurvey } = useSurveys();
  const { updateSurveyQuestions } = useSurveyQuestions(id);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  const handleSave = async (formData: any) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const surveyData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        background_color: formData.background_color,
        text_color: formData.text_color,
        button_color: formData.button_color,
        position: formData.position,
        type: formData.type,
        trigger_type: formData.trigger_type,
        auto_show: formData.auto_show,
        delay: formData.delay,
        show_close_button: formData.show_close_button,
        show_progress: formData.show_progress,
      };

      let surveyId = id;

      if (id) {
        // Update existing survey
        const updatedSurvey = await updateSurvey({ id, ...surveyData });
        toast({
          title: "Success",
          description: "Survey updated successfully",
        });
      } else {
        // Create new survey
        const newSurvey = await createSurvey(surveyData);
        surveyId = newSurvey.id;
        toast({
          title: "Success",
          description: "Survey created successfully",
        });
        navigate(`/surveys/${newSurvey.id}`);
      }

      // Update survey questions if we have a survey ID
      if (surveyId && formData.questions) {
        await updateSurveyQuestions(surveyId, formData.questions.map((question: any) => ({
          question_text: question.question_text,
          question_type: question.question_type,
          options: question.options,
          required: question.required || true,
        })));
      }

    } catch (error) {
      console.error('Error saving survey:', error);
      toast({
        title: "Error",
        description: "Failed to save survey",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return {
    survey,
    loading,
    isLoading,
    handleSave,
    handleBack,
  };
};
