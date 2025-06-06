
import { SurveyBuilder } from '@/components/SurveyBuilder';
import { SurveyPreview } from '@/components/SurveyPreview';
import { useSurveyPage } from '@/hooks/useSurveyPage';
import { LoadingSpinner } from '@/components/survey/SurveyLoadingSpinner';

const Survey = () => {
  const { survey, loading, isLoading, handleSave, handleBack } = useSurveyPage();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-screen flex">
      <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
        <SurveyBuilder
          survey={survey}
          onSave={handleSave}
          onBack={handleBack}
          isLoading={isLoading}
        />
      </div>
      <div className="w-1/2 overflow-y-auto bg-gray-50">
        <SurveyPreview survey={survey} />
      </div>
    </div>
  );
};

export default Survey;
