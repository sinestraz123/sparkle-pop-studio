
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MessageSquare, Star, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StepResponse {
  stepId: string;
  type: 'rating' | 'text';
  value: number | string;
  question: string;
}

interface FeedbackResponse {
  id: string;
  config_id: string;
  submitted_at: string;
  responses: StepResponse[];
}

interface FeedbackWidget {
  id: string;
  steps: any[];
}

const FeedbackResponses = () => {
  const { user } = useAuth();
  const [responses, setResponses] = useState<FeedbackResponse[]>([]);
  const [widgets, setWidgets] = useState<FeedbackWidget[]>([]);
  const [selectedWidget, setSelectedWidget] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  // Type guard to check if an object is a valid StepResponse
  const isValidStepResponse = (obj: any): obj is StepResponse => {
    return (
      obj &&
      typeof obj === 'object' &&
      typeof obj.stepId === 'string' &&
      (obj.type === 'rating' || obj.type === 'text') &&
      (typeof obj.value === 'string' || typeof obj.value === 'number') &&
      typeof obj.question === 'string'
    );
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's feedback widgets
      const { data: widgetsData, error: widgetsError } = await supabase
        .from('feedback_widgets')
        .select('id, steps')
        .eq('user_id', user!.id);

      if (widgetsError) {
        console.error('Error fetching widgets:', widgetsError);
        setError('Failed to fetch feedback widgets');
        return;
      }

      setWidgets(widgetsData || []);
      console.log('Fetched widgets:', widgetsData);

      // Fetch feedback responses for user's widgets
      const widgetIds = widgetsData?.map(w => w.id) || [];
      
      if (widgetIds.length === 0) {
        setResponses([]);
        return;
      }

      const { data: responsesData, error: responsesError } = await supabase
        .from('feedback_responses')
        .select('*')
        .in('config_id', widgetIds)
        .order('submitted_at', { ascending: false });

      if (responsesError) {
        console.error('Error fetching responses:', responsesError);
        setError('Failed to fetch feedback responses');
        return;
      }

      console.log('Fetched responses:', responsesData);

      // Transform the data to match our interface with proper type validation
      const transformedData: FeedbackResponse[] = responsesData?.map(item => ({
        id: item.id,
        config_id: item.config_id,
        submitted_at: item.submitted_at,
        responses: Array.isArray(item.responses) 
          ? (item.responses as any[]).filter(isValidStepResponse)
          : []
      })) || [];
      
      setResponses(transformedData);
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const getWidgetTitle = (configId: string) => {
    const widget = widgets.find(w => w.id === configId);
    const widgetIndex = widgets.findIndex(w => w.id === configId);
    return widget ? `Feedback Widget #${widgetIndex + 1}` : 'Unknown Widget';
  };

  const filteredResponses = selectedWidget === 'all' 
    ? responses 
    : responses.filter(r => r.config_id === selectedWidget);

  if (loading) {
    return (
      <div className="h-screen flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Feedback Responses</h1>
          <p className="text-gray-600 mt-1">View and analyze customer feedback submissions</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading feedback responses...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Feedback Responses</h1>
          <p className="text-gray-600 mt-1">View and analyze customer feedback submissions</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Responses</h3>
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Feedback Responses</h1>
            <p className="text-gray-600 mt-1">View and analyze customer feedback submissions</p>
          </div>
          
          {widgets.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Filter by widget:</span>
              <Select value={selectedWidget} onValueChange={setSelectedWidget}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Widgets</SelectItem>
                  {widgets.map((widget, index) => (
                    <SelectItem key={widget.id} value={widget.id}>
                      Feedback Widget #{index + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {filteredResponses.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {selectedWidget === 'all' ? 'No responses yet' : 'No responses for this widget'}
                </h3>
                <p className="text-gray-500">
                  {selectedWidget === 'all' 
                    ? 'Feedback responses will appear here once customers start submitting feedback.'
                    : 'This feedback widget hasn\'t received any responses yet.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredResponses.map((response) => (
              <Card key={response.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Response #{response.id.slice(0, 8)}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        From: {getWidgetTitle(response.config_id)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {formatDate(response.submitted_at)}
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
