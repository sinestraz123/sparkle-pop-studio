
import React, { useState } from 'react';
import { Accordion } from '@/components/ui/accordion';
import { SurveyPreview } from './SurveyPreview';
import { SurveyBuilderHeader } from './SurveyBuilderHeader';
import { SurveyBasicSection } from './SurveyBasicSection';
import { SurveyQuestionsSection } from './SurveyQuestionsSection';
import { SurveyDisplaySection } from './SurveyDisplaySection';
import { SurveyEmbedSection } from './SurveyEmbedSection';

interface SurveyBuilderComponentProps {
  survey: any;
  questions: any[];
  onSave: (data: any) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const SurveyBuilderComponent: React.FC<SurveyBuilderComponentProps> = ({
  survey,
  questions,
  onSave,
  onBack,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: survey?.title || 'New Survey',
    description: survey?.description || 'Please take a moment to answer our questions.',
    status: survey?.status || 'draft',
    position: survey?.position || 'center',
    background_color: survey?.background_color || '#ffffff',
    text_color: survey?.text_color || '#000000',
    button_color: survey?.button_color || '#3b82f6',
    submit_button_text: survey?.submit_button_text || 'Submit Survey',
    show_close_button: survey?.show_close_button ?? true,
    auto_show: survey?.auto_show ?? false,
    delay: survey?.delay || 2000,
  });

  const [previewMode, setPreviewMode] = useState(false);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Sidebar - Configuration */}
      <div className="w-[480px] bg-white border-r border-gray-200 overflow-y-auto">
        <SurveyBuilderHeader
          formData={formData}
          previewMode={previewMode}
          isLoading={isLoading}
          onBack={onBack}
          onPreviewToggle={setPreviewMode}
          onSave={handleSave}
          onStatusChange={(status) => updateFormData('status', status)}
        />

        {!previewMode && (
          <div className="p-6">
            <Accordion type="multiple" defaultValue={["basic"]} className="space-y-4">
              <SurveyBasicSection
                formData={formData}
                updateFormData={updateFormData}
              />

              <SurveyQuestionsSection
                surveyId={survey.id}
                questions={questions}
              />

              <SurveyDisplaySection
                formData={formData}
                updateFormData={updateFormData}
              />

              <SurveyEmbedSection />
            </Accordion>
          </div>
        )}
      </div>

      {/* Right Side - Preview */}
      <div className="flex-1 bg-gradient-to-br from-teal-100 via-green-100 to-blue-200 relative">
        <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-1 text-sm text-gray-600">
          yourwebsite.com
        </div>
        
        <SurveyPreview survey={formData} questions={questions} />
      </div>
    </div>
  );
};
