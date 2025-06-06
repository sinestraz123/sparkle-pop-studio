import { useState, useEffect } from 'react';
import { SurveyBuilderHeader } from '@/components/survey-builder/SurveyBuilderHeader';
import { SurveyContentSection } from '@/components/survey-builder/SurveyContentSection';
import { SurveyQuestionsSection } from '@/components/survey-builder/SurveyQuestionsSection';
import { SurveySettingsSection } from '@/components/survey-builder/SurveySettingsSection';
import { SurveyTriggerSection } from '@/components/survey-builder/SurveyTriggerSection';
import { useSurveyQuestionsManager } from '@/hooks/useSurveys';

interface SurveyBuilderProps {
  survey?: any;
  onSave: (data: any) => void;
  onBack: () => void;
  isLoading: boolean;
}

export const SurveyBuilder = ({ survey, onSave, onBack, isLoading }: SurveyBuilderProps) => {
  const { questions } = useSurveyQuestionsManager(survey?.id);
  const [formData, setFormData] = useState({
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
      setFormData(prev => ({
        ...prev,
        questions: questions.map(q => ({
          question_text: q.question_text,
          question_type: q.question_type,
          options: q.options,
          required: q.required,
        })),
      }));
    }
  }, [questions]);

  const handleSave = () => {
    onSave(formData);
  };

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="h-full flex flex-col">
      <SurveyBuilderHeader
        title={formData.title || 'New Survey'}
        onBack={onBack}
        onSave={handleSave}
        isLoading={isLoading}
        status={formData.status}
        onStatusChange={(status) => updateFormData({ status })}
      />
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <SurveyContentSection
          title={formData.title}
          description={formData.description}
          onTitleChange={(title) => updateFormData({ title })}
          onDescriptionChange={(description) => updateFormData({ description })}
        />

        <SurveyQuestionsSection
          questions={formData.questions}
          onQuestionsChange={(questions) => updateFormData({ questions })}
        />

        <SurveySettingsSection
          backgroundColor={formData.background_color}
          textColor={formData.text_color}
          buttonColor={formData.button_color}
          position={formData.position}
          showCloseButton={formData.show_close_button}
          showProgress={formData.show_progress}
          onBackgroundColorChange={(background_color) => updateFormData({ background_color })}
          onTextColorChange={(text_color) => updateFormData({ text_color })}
          onButtonColorChange={(button_color) => updateFormData({ button_color })}
          onPositionChange={(position) => updateFormData({ position })}
          onShowCloseButtonChange={(show_close_button) => updateFormData({ show_close_button })}
          onShowProgressChange={(show_progress) => updateFormData({ show_progress })}
        />

        <SurveyTriggerSection
          triggerType={formData.trigger_type}
          autoShow={formData.auto_show}
          delay={formData.delay}
          onTriggerTypeChange={(trigger_type) => updateFormData({ trigger_type })}
          onAutoShowChange={(auto_show) => updateFormData({ auto_show })}
          onDelayChange={(delay) => updateFormData({ delay })}
        />
      </div>
    </div>
  );
};
