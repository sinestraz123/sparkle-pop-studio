
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SurveyQuestionRenderer } from './SurveyQuestionRenderer';

interface SurveyPreviewCardProps {
  survey: any;
  questions: any[];
}

export const SurveyPreviewCard = ({ survey, questions }: SurveyPreviewCardProps) => {
  const surveyStyle = {
    backgroundColor: survey?.background_color || '#ffffff',
    color: survey?.text_color || '#000000',
  };

  const buttonStyle = {
    backgroundColor: survey?.button_color || '#3b82f6',
  };

  return (
    <Card className="border-2" style={surveyStyle}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold">{survey?.title || 'Untitled Survey'}</CardTitle>
        {survey?.description && (
          <p className="text-sm opacity-80 mt-2">{survey.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {questions.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No questions added yet. Add questions to see the preview.
          </p>
        ) : (
          questions.map((question, index) => (
            <SurveyQuestionRenderer key={question.id} question={question} index={index} />
          ))
        )}
        
        {questions.length > 0 && (
          <div className="pt-4 border-t">
            <Button 
              className="w-full text-white"
              style={buttonStyle}
              disabled
            >
              {survey?.submit_button_text || 'Submit'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
