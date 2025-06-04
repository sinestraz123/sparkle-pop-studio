
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSurvey } from '@/hooks/useSurveys';
import { SurveyBuilderComponent } from '@/components/survey-builder/SurveyBuilderComponent';

const SurveyBuilder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { survey, questions, isLoading, updateSurvey } = useSurvey(id!);

  const handleSave = (data: any) => {
    updateSurvey(data);
  };

  const handleBack = () => {
    navigate('/surveys');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Survey not found</h2>
          <p className="text-gray-600 mb-4">The survey you're looking for doesn't exist or you don't have permission to access it.</p>
          <button onClick={handleBack} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded">
            Back to Surveys
          </button>
        </div>
      </div>
    );
  }

  return (
    <SurveyBuilderComponent
      survey={survey}
      questions={questions}
      onSave={handleSave}
      onBack={handleBack}
      isLoading={isLoading}
    />
  );
};

export default SurveyBuilder;
