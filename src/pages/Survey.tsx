
import { SurveyBuilder } from '@/components/SurveyBuilder';
import { SurveyPreview } from '@/components/SurveyPreview';
import { useSurveyPage } from '@/hooks/useSurveyPage';
import { LoadingSpinner } from '@/components/survey/SurveyLoadingSpinner';
import { useState, useEffect } from 'react';

const Survey = () => {
  const { survey, loading, isLoading, handleSave, handleBack } = useSurveyPage();
  const [previewData, setPreviewData] = useState(survey);

  // Update preview data when survey changes
  useEffect(() => {
    setPreviewData(survey);
  }, [survey]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const handleBuilderChange = (formData: any) => {
    // Update preview data immediately when builder data changes
    setPreviewData(formData);
  };

  return (
    <div className="h-screen flex">
      <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
        <SurveyBuilder
          survey={survey}
          onSave={handleSave}
          onBack={handleBack}
          isLoading={isLoading}
          onDataChange={handleBuilderChange}
        />
      </div>
      <div className="w-1/2 overflow-y-auto bg-gray-50">
        <SurveyPreview survey={previewData} />
      </div>
    </div>
  );
};

export default Survey;
