
import React, { useState } from 'react';
import { Accordion } from '@/components/ui/accordion';
import { SurveyPreview } from './SurveyPreview';
import { BuilderHeader } from './survey-builder/SurveyBuilderHeader';
import { SettingsSection } from './survey-builder/SurveySettingsSection';
import { ContentSection } from './survey-builder/SurveyContentSection';
import { QuestionsSection } from './survey-builder/SurveyQuestionsSection';
import { TriggerSection } from './survey-builder/SurveyTriggerSection';
import { SurveyWithQuestions } from '@/hooks/useSurveys';

interface SurveyQuestion {
  id: string;
  question_text: string;
  question_type: 'text' | 'multiple_choice' | 'rating' | 'yes_no';
  options?: string[];
  required: boolean;
}

interface SurveyFormData {
  title: string;
  description: string;
  type: string;
  position: string;
  background_color: string;
  text_color: string;
  button_color: string;
  submit_button_text: string;
  show_close_button: boolean;
  auto_show: boolean;
  delay: number;
  status: string;
  questions: SurveyQuestion[];
}

interface SurveyBuilderProps {
  survey?: SurveyWithQuestions;
  onSave: (data: SurveyFormData) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const SurveyBuilder: React.FC<SurveyBuilderProps> = ({
  survey,
  onSave,
  onBack,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<SurveyFormData>({
    title: survey?.title || 'Customer Feedback Survey',
    description: survey?.description || 'Help us improve by sharing your thoughts',
    type: survey?.type || 'modal',
    position: survey?.position || 'center',
    background_color: survey?.background_color || '#ffffff',
    text_color: survey?.text_color || '#000000',
    button_color: survey?.button_color || '#3b82f6',
    submit_button_text: survey?.submit_button_text || 'Submit',
    show_close_button: survey?.show_close_button ?? true,
    auto_show: survey?.auto_show ?? false,
    delay: survey?.delay || 0,
    status: survey?.status || 'draft',
    questions: survey?.survey_questions?.map(q => ({
      id: q.id,
      question_text: q.question_text,
      question_type: q.question_type as 'text' | 'multiple_choice' | 'rating' | 'yes_no',
      options: q.options ? (q.options as string[]) : undefined,
      required: q.required || false,
    })) || [
      {
        id: '1',
        question_text: 'How would you rate your overall experience?',
        question_type: 'rating',
        required: true,
      },
      {
        id: '2',
        question_text: 'What could we improve?',
        question_type: 'text',
        required: false,
      },
    ],
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateQuestion = (questionId: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, [field]: value } : q
      )
    }));
  };

  const addQuestion = () => {
    const newQuestion: SurveyQuestion = {
      id: Date.now().toString(),
      question_text: 'New question',
      question_type: 'text',
      required: false,
    };
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const removeQuestion = (questionId: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Sidebar - Configuration */}
      <div className="w-[480px] bg-white border-r border-gray-200 flex flex-col">
        <BuilderHeader
          formData={formData}
          isLoading={isLoading}
          onBack={onBack}
          onSave={handleSave}
          onStatusChange={(status) => updateFormData('status', status)}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Accordion type="multiple" defaultValue={["content"]} className="space-y-4">
              <SettingsSection
                formData={formData}
                updateFormData={updateFormData}
              />

              <ContentSection
                formData={formData}
                updateFormData={updateFormData}
              />

              <QuestionsSection
                questions={formData.questions}
                updateQuestion={updateQuestion}
                addQuestion={addQuestion}
                removeQuestion={removeQuestion}
              />

              <TriggerSection
                formData={formData}
                updateFormData={updateFormData}
              />
            </Accordion>
          </div>
        </div>
      </div>

      {/* Right Side - Preview */}
      <div className="flex-1 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative">
        <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-1 text-sm text-gray-600 shadow-sm">
          yourwebsite.com
        </div>
        
        <SurveyPreview config={formData} />
      </div>
    </div>
  );
};
