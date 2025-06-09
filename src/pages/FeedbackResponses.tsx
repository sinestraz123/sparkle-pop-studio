
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MessageSquare, Star } from 'lucide-react';

interface FeedbackResponse {
  id: string;
  submittedAt: string;
  responses: Array<{
    stepId: string;
    type: 'rating' | 'text';
    value: number | string;
    question: string;
  }>;
}

const FeedbackResponses = () => {
  const [responses, setResponses] = useState<FeedbackResponse[]>([]);

  // Mock data for demonstration - in real app this would come from your backend
  useEffect(() => {
    const mockResponses: FeedbackResponse[] = [
      {
        id: '1',
        submittedAt: '2024-01-15T10:30:00Z',
        responses: [
          {
            stepId: 'step1',
            type: 'rating',
            value: 8,
            question: 'How likely are you to recommend us to a friend?'
          },
          {
            stepId: 'step2',
            type: 'text',
            value: 'Great service overall, could improve response time.',
            question: 'What could we improve?'
          }
        ]
      },
      {
        id: '2',
        submittedAt: '2024-01-14T15:45:00Z',
        responses: [
          {
            stepId: 'step1',
            type: 'rating',
            value: 9,
            question: 'How likely are you to recommend us to a friend?'
          }
        ]
      },
      {
        id: '3',
        submittedAt: '2024-01-14T09:20:00Z',
        responses: [
          {
            stepId: 'step1',
            type: 'rating',
            value: 6,
            question: 'How likely are you to recommend us to a friend?'
          },
          {
            stepId: 'step2',
            type: 'text',
            value: 'The product is good but the pricing seems a bit high.',
            question: 'What could we improve?'
          }
        ]
      }
    ];
    setResponses(mockResponses);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNPSCategory = (score: number) => {
    if (score >= 9) return { label: 'Promoter', color: 'bg-green-100 text-green-800' };
    if (score >= 7) return { label: 'Passive', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Detractor', color: 'bg-red-100 text-red-800' };
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Feedback Responses</h1>
        <p className="text-gray-600 mt-1">View and analyze customer feedback submissions</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {responses.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No responses yet</h3>
                <p className="text-gray-500">Feedback responses will appear here once customers start submitting feedback.</p>
              </CardContent>
            </Card>
          ) : (
            responses.map((response) => (
              <Card key={response.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Response #{response.id}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {formatDate(response.submittedAt)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {response.responses.map((item, index) => (
                      <div key={index} className="border-l-4 border-blue-200 pl-4">
                        <h4 className="font-medium text-gray-900 mb-2">{item.question}</h4>
                        
                        {item.type === 'rating' ? (
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="font-semibold">{item.value}/10</span>
                            </div>
                            {item.question.toLowerCase().includes('recommend') && (
                              <Badge className={getNPSCategory(item.value as number).color}>
                                {getNPSCategory(item.value as number).label}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-gray-700">{item.value}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackResponses;
