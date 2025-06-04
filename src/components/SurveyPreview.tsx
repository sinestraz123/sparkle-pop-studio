
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Star } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const updateResponse = (questionId: string, value: any) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < config.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmit();
    }
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
      <div className="fixed inset-0 bg-black/30 flex items-end justify-center pb-20 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 text-center animate-fade-in">
          <div className="text-green-500 text-4xl mb-4">✓</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Thank you!</h3>
          <p className="text-gray-600">Your feedback has been submitted.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = config.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === config.questions.length - 1;

  const renderQuestion = (question: SurveyQuestion) => {
    switch (question.question_type) {
      case 'text':
        return (
          <Textarea
            placeholder="Please share your thoughts..."
            value={responses[question.id] || ''}
            onChange={(e) => updateResponse(question.id, e.target.value)}
            className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
            rows={4}
          />
        );

      case 'multiple_choice':
        if (!question.options) return null;
        return (
          <Select 
            value={responses[question.id] || ''} 
            onValueChange={(value) => updateResponse(question.id, value)}
          >
            <SelectTrigger className="w-full bg-gray-50 border-gray-200 focus:border-blue-500">
              <SelectValue placeholder="Select one..." />
            </SelectTrigger>
            <SelectContent>
              {question.options.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'rating':
        const rating = responses[question.id] || 0;
        // Check if it's an NPS-style question (0-10 scale)
        const isNPS = question.question_text.toLowerCase().includes('recommend') || 
                     question.question_text.toLowerCase().includes('likely');
        const maxRating = isNPS ? 10 : 5;
        const ratingArray = Array.from({ length: maxRating + 1 }, (_, i) => i);
        
        if (isNPS) {
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-11 gap-2">
                {ratingArray.map((score) => (
                  <button
                    key={score}
                    onClick={() => updateResponse(question.id, score)}
                    className={`
                      h-12 w-12 rounded-lg border-2 transition-all duration-200 font-medium
                      ${score <= rating 
                        ? 'bg-blue-500 border-blue-500 text-white' 
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }
                    `}
                  >
                    {score}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>0 - Not likely</span>
                <span>10 - Very likely</span>
              </div>
            </div>
          );
        } else {
          return (
            <div className="flex gap-2 justify-center">
              {ratingArray.slice(1).map((star) => (
                <button
                  key={star}
                  onClick={() => updateResponse(question.id, star)}
                  className="p-1"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          );
        }

      case 'yes_no':
        return (
          <div className="flex gap-4 justify-center">
            {['Yes', 'No'].map((option) => (
              <button
                key={option}
                onClick={() => updateResponse(question.id, option.toLowerCase())}
                className={`
                  px-8 py-3 rounded-lg border-2 transition-all duration-200 font-medium
                  ${responses[question.id] === option.toLowerCase()
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }
                `}
              >
                {option}
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-end justify-center pb-20 z-50">
      <div 
        className="relative rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 border border-gray-100 animate-fade-in"
        style={{ backgroundColor: config.background_color }}
      >
        {/* Close button */}
        {config.show_close_button && (
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Progress indicator */}
        {config.questions.length > 1 && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Question {currentQuestionIndex + 1} of {config.questions.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / config.questions.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Question */}
        <div className="space-y-6">
          <div>
            <h2 
              className="text-lg font-semibold mb-6 leading-relaxed"
              style={{ color: config.text_color }}
            >
              {currentQuestion.question_text}
              {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
            </h2>
            {renderQuestion(currentQuestion)}
          </div>

          {/* Action button */}
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleNext}
              style={{ backgroundColor: config.button_color }}
              className="text-white hover:opacity-90 px-8 py-2 rounded-lg font-medium"
              disabled={currentQuestion.required && !responses[currentQuestion.id]}
            >
              {isLastQuestion ? config.submit_button_text : 'Next'}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center pt-6 mt-6 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-400">
            <span className="mr-1">⚡</span>
            <span>Powered by Likemetric</span>
          </div>
        </div>
      </div>
    </div>
  );
};
