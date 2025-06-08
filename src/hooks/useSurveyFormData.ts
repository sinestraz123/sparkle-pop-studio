
import { useState, useEffect } from 'react';
import { useSurveyQuestionsManager } from '@/hooks/useSurveys';

interface SurveyFormData {
  title: string;
  description: string;
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
  questions: any[];
}

export const useSurveyFormData = (survey?: any, onDataChange?: (data: any) => void) => {
  const { questions } = useSurveyQuestionsManager(survey?.id);
  
  const [formData, setFormData] = useState<SurveyFormData>({
    title: '',
    description: '',
    status: 'draft',
    background_color: '#ffffff',
    text_color: '#000000',
    button_color: '#3b82f6',
    position: 'center',
    type: 'modal',
    trigger_type: 'auto_show',
    auto_show: false,
    delay: 0,
    show_close_button: true,
    show_progress: true,
    questions: [],
  });

  useEffect(() => {
    if (survey) {
      setFormData({
        title: survey.title || '',
        description: survey.description || '',
        status: survey.status || 'draft',
        background_color: survey.background_color || '#ffffff',
        text_color: survey.text_color || '#000000',
        button_color: survey.button_color || '#3b82f6',
        position: survey.position || 'center',
        type: survey.type || 'modal',
        trigger_type: survey.trigger_type || 'auto_show',
        auto_show: survey.auto_show || false,
        delay: survey.delay || 0,
        show_close_button: survey.show_close_button ?? true,
        show_progress: survey.show_progress ?? true,
        questions: [],
      });
    }
  }, [survey]);

  useEffect(() => {
    if (questions) {
      const mappedQuestions = questions.map(q => ({
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options,
        required: q.required,
      }));
      setFormData(prev => ({
        ...prev,
        questions: mappedQuestions,
      }));
    }
  }, [questions]);

  // Notify parent component when formData changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  const updateFormData = (updates: Partial<SurveyFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return {
    formData,
    updateFormData,
  };
};
