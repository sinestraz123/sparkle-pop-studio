
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface SurveyPreviewProps {
  survey?: any;
}

export const SurveyPreview = ({ survey }: SurveyPreviewProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<number, any>>({});

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

  const questions = survey.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleResponse = (value: any) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestionIndex]: value,
    }));
  };

  const renderQuestion = () => {
    if (!currentQuestion) {
      return (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No questions added</h3>
          <p className="text-gray-500">Add questions to see them in the preview</p>
        </div>
      );
    }

    const response = responses[currentQuestionIndex];

    switch (currentQuestion.question_type) {
      case 'multiple_choice':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium" style={{ color: survey.text_color }}>
              {currentQuestion.question_text}
            </h3>
            <div className="space-y-3">
              {currentQuestion.options?.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-3">
                  <Checkbox
                    id={`option-${index}`}
                    checked={Array.isArray(response) && response.includes(option)}
                    onCheckedChange={(checked) => {
                      const currentResponses = Array.isArray(response) ? response : [];
                      if (checked) {
                        handleResponse([...currentResponses, option]);
                      } else {
                        handleResponse(currentResponses.filter((r: string) => r !== option));
                      }
                    }}
                  />
                  <Label htmlFor={`option-${index}`} className="text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'single_choice':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium" style={{ color: survey.text_color }}>
              {currentQuestion.question_text}
            </h3>
            <RadioGroup
              value={response || ''}
              onValueChange={handleResponse}
            >
              {currentQuestion.options?.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`radio-${index}`} />
                  <Label htmlFor={`radio-${index}`} className="text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'text_input':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium" style={{ color: survey.text_color }}>
              {currentQuestion.question_text}
            </h3>
            <Input
              value={response || ''}
              onChange={(e) => handleResponse(e.target.value)}
              placeholder="Type your answer..."
            />
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium" style={{ color: survey.text_color }}>
              {currentQuestion.question_text}
            </h3>
            <Textarea
              value={response || ''}
              onChange={(e) => handleResponse(e.target.value)}
              placeholder="Type your answer..."
              rows={4}
            />
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Unknown question type</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-8" style={{ backgroundColor: '#f9fafb' }}>
      <div
        className="w-full max-w-md p-6 rounded-lg shadow-lg relative"
        style={{ backgroundColor: survey.background_color }}
      >
        {survey.show_close_button && (
          <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2" style={{ color: survey.text_color }}>
            {survey.title || 'Survey Title'}
          </h2>
          {survey.description && (
            <p className="text-sm opacity-75" style={{ color: survey.text_color }}>
              {survey.description}
            </p>
          )}
        </div>

        {survey.show_progress && questions.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-xs mb-2" style={{ color: survey.text_color }}>
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="mb-6">
          {renderQuestion()}
        </div>

        {questions.length > 0 && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            <Button
              onClick={handleNext}
              disabled={currentQuestionIndex === questions.length - 1}
              style={{ backgroundColor: survey.button_color }}
              className="flex items-center space-x-2 text-white"
            >
              <span>{currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
