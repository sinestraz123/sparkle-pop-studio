
import { SurveyBuilder } from '@/components/SurveyBuilder';
import { SurveyPreview } from '@/components/SurveyPreview';
import { SurveyResponsesTable } from '@/components/survey-analytics/SurveyResponsesTable';
import { useSurveyPage } from '@/hooks/useSurveyPage';
import { LoadingSpinner } from '@/components/survey/SurveyLoadingSpinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Survey = () => {
  const { id } = useParams();
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
    <div className="h-screen flex flex-col">
      <Tabs defaultValue="builder" className="flex-1 flex flex-col">
        <div className="border-b border-gray-200 px-4 py-2">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="builder">Builder & Preview</TabsTrigger>
            <TabsTrigger value="responses">Responses</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="builder" className="flex-1 flex m-0">
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
        </TabsContent>

        <TabsContent value="responses" className="flex-1 overflow-y-auto m-0 p-6">
          {id ? (
            <SurveyResponsesTable surveyId={id} />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Save your survey first to view responses</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Survey;
