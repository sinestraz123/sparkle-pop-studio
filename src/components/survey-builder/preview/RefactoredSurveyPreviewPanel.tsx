
import { SurveyPreviewCard } from './SurveyPreviewCard';
import { SurveyInfoCard } from './SurveyInfoCard';

interface RefactoredSurveyPreviewPanelProps {
  survey: any;
  questions: any[];
}

export const RefactoredSurveyPreviewPanel = ({ survey, questions }: RefactoredSurveyPreviewPanelProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Survey Preview</h3>
        <SurveyPreviewCard survey={survey} questions={questions} />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Survey Information</h3>
        <SurveyInfoCard survey={survey} questions={questions} />
      </div>
    </div>
  );
};
