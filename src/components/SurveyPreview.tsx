
import { QuestionRenderer } from '@/components/survey-preview/QuestionRenderer';
import { SurveyNavigation } from '@/components/survey-preview/SurveyNavigation';
import { SurveyHeader } from '@/components/survey-preview/SurveyHeader';
import { useSurveyPreview } from '@/hooks/useSurveyPreview';

interface SurveyPreviewProps {
  survey?: any;
}

export const SurveyPreview = ({ survey }: SurveyPreviewProps) => {
  const {
    currentQuestionIndex,
    currentQuestion,
    questions,
    responses,
    progress,
    handleNext,
    handlePrevious,
    handleResponse,
  } = useSurveyPreview(survey);

  if (!survey) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Survey Preview</h3>
          <p className="text-gray-500">Configure your survey to see the preview</p>
        </div>
      </div>
    );
  }

  const response = responses[currentQuestionIndex];

  return (
    <div className="h-full flex items-center justify-center p-8" style={{ backgroundColor: '#f9fafb' }}>
      <div
        className="w-full max-w-md p-6 rounded-lg shadow-lg relative"
        style={{ backgroundColor: survey.background_color }}
      >
        <SurveyHeader
          title={survey.title}
          description={survey.description}
          textColor={survey.text_color}
          showCloseButton={survey.show_close_button}
          showProgress={survey.show_progress}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          progress={progress}
        />

        <div className="mb-6">
          <QuestionRenderer
            question={currentQuestion}
            response={response}
            onResponse={handleResponse}
            textColor={survey.text_color}
          />
        </div>

        <SurveyNavigation
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          buttonColor={survey.button_color}
        />
      </div>
    </div>
  );
};
