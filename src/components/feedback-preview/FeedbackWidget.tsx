import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MessageSquare, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface StepResponse {
  stepId: string;
  type: 'rating' | 'text';
  value: number | string;
  question: string;
}

interface FeedbackWidgetProps {
  config: any;
  onClose: () => void;
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ config, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<StepResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResponse = (stepId: string, type: 'rating' | 'text', value: number | string, question: string) => {
    const newResponse: StepResponse = { stepId, type, value, question };
    setResponses(prev => [...prev.filter(r => r.stepId !== stepId), newResponse]);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Convert StepResponse[] to Json by creating a plain object
      const responsesAsJson = responses.map(r => ({
        stepId: r.stepId,
        type: r.type,
        value: r.value,
        question: r.question
      }));

      const { error } = await supabase
        .from('feedback_responses')
        .insert({
          config_id: config.id || 'default',
          responses: responsesAsJson as any, // Type assertion for Json
          user_id: null
        });

      if (error) {
        console.error('Error submitting feedback:', error);
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const renderStepContent = () => {
    const step = config.steps[currentStep];

    if (!step) {
      return <div>No more steps</div>;
    }

    switch (step.type) {
      case 'rating':
        return (
          <div className="space-y-2">
            <p>{step.question}</p>
            <div className="flex gap-1">
              {[...Array(10)].map((_, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => handleResponse(step.id, 'rating', i + 1, step.question)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          </div>
        );
      case 'text':
        return (
          <div className="space-y-2">
            <p>{step.question}</p>
            {/* Implement text input here */}
            <input
              type="text"
              className="w-full border rounded-md p-2"
              onChange={(e) => handleResponse(step.id, 'text', e.target.value, step.question)}
            />
          </div>
        );
      default:
        return <div>Unknown step type</div>;
    }
  };
  
  return (
    <Card className="w-96 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Feedback</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <p>How would you rate our service?</p>
            <div className="flex gap-1">
              {[...Array(10)].map((_, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => handleResponse('rating', 'rating', i + 1, 'How would you rate our service?')}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
