
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Star } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface SurveyQuestion {
  id: string;
  question_text: string;
  question_type: 'text' | 'multiple_choice' | 'rating' | 'yes_no';
  options?: string[];
  required: boolean;
}

interface SurveyConfig {
  title: string;
  description: string;
  type: string;
  position: string;
  background_color: string;
  text_color: string;
  button_color: string;
  submit_button_text: string;
  show_close_button: boolean;
  auto_show: boolean;
  delay: number;
  questions: SurveyQuestion[];
}

interface SurveyPreviewProps {
  config: SurveyConfig;
}

export const SurveyPreview: React.FC<SurveyPreviewProps> = ({ config }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateResponse = (questionId: string, value: any) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    console.log('Survey responses:', responses);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 2000);
  };

  if (!isVisible) return null;

  if (isSubmitted) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <div 
          className="relative rounded-xl shadow-2xl max-w-md mx-auto p-8 border border-gray-100 text-center"
          style={{ backgroundColor: config.background_color, color: config.text_color }}
        >
          <div className="text-green-500 text-4xl mb-4">✓</div>
          <h3 className="text-lg font-semibold mb-2">Thank you!</h3>
          <p className="text-sm opacity-75">Your response has been submitted.</p>
        </div>
      </div>
    );
  }

  const renderQuestion = (question: SurveyQuestion) => {
    switch (question.question_type) {
      case 'text':
        return (
          <Textarea
            placeholder="Type your answer here..."
            value={responses[question.id] || ''}
            onChange={(e) => updateResponse(question.id, e.target.value)}
            className="w-full"
          />
        );

      case 'multiple_choice':
        if (!question.options) return null;
        return (
          <RadioGroup
            value={responses[question.id] || ''}
            onValueChange={(value) => updateResponse(question.id, value)}
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'rating':
        const rating = responses[question.id] || 0;
        return (
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => updateResponse(question.id, star)}
                className="p-1"
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        );

      case 'yes_no':
        return (
          <RadioGroup
            value={responses[question.id] || ''}
            onValueChange={(value) => updateResponse(question.id, value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id={`${question.id}-yes`} />
              <Label htmlFor={`${question.id}-yes`}>Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id={`${question.id}-no`} />
              <Label htmlFor={`${question.id}-no`}>No</Label>
            </div>
          </RadioGroup>
        );

      default:
        return null;
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div 
        className="relative rounded-xl shadow-2xl max-w-md mx-auto p-6 border border-gray-100"
        style={{ backgroundColor: config.background_color, color: config.text_color }}
      >
        {/* Close button */}
        {config.show_close_button && (
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Header */}
        <div className="mb-6 pr-8">
          <h2 className="text-xl font-bold mb-2">{config.title}</h2>
          <p className="text-sm opacity-75 mb-6">{config.description}</p>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-6">
          {config.questions.map((question) => (
            <div key={question.id} className="space-y-3">
              <label className="block text-sm font-medium">
                {question.question_text}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderQuestion(question)}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit}
            style={{ backgroundColor: config.button_color }}
            className="text-white hover:opacity-90"
          >
            {config.submit_button_text}
          </Button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center pt-4 border-t border-gray-100 mt-6">
          <div className="flex items-center text-xs text-gray-500">
            <span className="mr-1">⚡</span>
            <span>Powered by Likemetric</span>
          </div>
        </div>
      </div>
    </div>
  );
};
