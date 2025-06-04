
import { Card, CardContent } from '@/components/ui/card';

interface SurveyInfoCardProps {
  survey: any;
  questions: any[];
}

export const SurveyInfoCard = ({ survey, questions }: SurveyInfoCardProps) => {
  return (
    <Card>
      <CardContent className="space-y-3 pt-6">
        <div className="flex justify-between">
          <span className="font-medium">Status:</span>
          <span className={`px-2 py-1 rounded text-sm ${
            survey?.status === 'active' ? 'bg-green-100 text-green-800' :
            survey?.status === 'draft' ? 'bg-gray-100 text-gray-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {survey?.status || 'Draft'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Questions:</span>
          <span>{questions.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Responses:</span>
          <span>{survey?.responses || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Views:</span>
          <span>{survey?.views || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Auto Show:</span>
          <span>{survey?.auto_show ? 'Yes' : 'No'}</span>
        </div>
        {survey?.auto_show && (
          <div className="flex justify-between">
            <span className="font-medium">Delay:</span>
            <span>{survey.delay || 0}s</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
