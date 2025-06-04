
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface SurveyPreviewProps {
  survey: any;
  questions: any[];
}

export const SurveyPreview: React.FC<SurveyPreviewProps> = ({ survey, questions }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});

  const updateResponse = (questionId: string, value: any) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderQuestion = (question: any) => {
    const response = responses[question.id];
    
    switch (question.question_type) {
      case 'text':
      case 'email':
        return (
          <Input 
            type={question.question_type === 'email' ? 'email' : 'text'}
            placeholder="Your answer..."
            value={response || ''}
            onChange={(e) => updateResponse(question.id, e.target.value)}
            className="text-lg p-4 border-0 bg-gray-50 rounded-xl focus:bg-white transition-colors"
          />
        );
      
      case 'number':
        return (
          <Input 
            type="number" 
            placeholder="0"
            value={response || ''}
            onChange={(e) => updateResponse(question.id, e.target.value)}
            className="text-lg p-4 border-0 bg-gray-50 rounded-xl focus:bg-white transition-colors"
          />
        );
      
      case 'textarea':
        return (
          <Textarea 
            placeholder="Your answer..."
            value={response || ''}
            onChange={(e) => updateResponse(question.id, e.target.value)}
            rows={4}
            className="text-lg p-4 border-0 bg-gray-50 rounded-xl focus:bg-white transition-colors resize-none"
          />
        );
      
      case 'radio':
        const radioOptions = question.options || [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' }
        ];
        return (
          <RadioGroup 
            value={response || ''} 
            onValueChange={(value) => updateResponse(question.id, value)}
            className="space-y-3"
          >
            {radioOptions.map((option: any, optIndex: number) => (
              <div key={optIndex} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value={option.value} id={`${question.id}-${optIndex}`} className="text-teal-600" />
                <Label htmlFor={`${question.id}-${optIndex}`} className="text-lg cursor-pointer flex-1">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      
      case 'checkbox':
        const checkboxOptions = question.options || [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' }
        ];
        const checkboxResponse = response || [];
        return (
          <div className="space-y-3">
            {checkboxOptions.map((option: any, optIndex: number) => (
              <div key={optIndex} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Checkbox 
                  id={`${question.id}-${optIndex}`}
                  checked={checkboxResponse.includes(option.value)}
                  onCheckedChange={(checked) => {
                    const newResponse = checked 
                      ? [...checkboxResponse, option.value]
                      : checkboxResponse.filter((v: string) => v !== option.value);
                    updateResponse(question.id, newResponse);
                  }}
                  className="text-teal-600"
                />
                <Label htmlFor={`${question.id}-${optIndex}`} className="text-lg cursor-pointer flex-1">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        );
      
      case 'select':
        const selectOptions = question.options || [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' }
        ];
        return (
          <Select value={response || ''} onValueChange={(value) => updateResponse(question.id, value)}>
            <SelectTrigger className="text-lg p-4 border-0 bg-gray-50 rounded-xl focus:bg-white transition-colors">
              <SelectValue placeholder="Select one..." />
            </SelectTrigger>
            <SelectContent>
              {selectOptions.map((option: any, optIndex: number) => (
                <SelectItem key={optIndex} value={option.value} className="text-lg">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'rating':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                <button
                  key={rating}
                  onClick={() => updateResponse(question.id, rating)}
                  className={`w-12 h-12 rounded-lg border-2 text-lg font-semibold transition-all ${
                    response === rating
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-teal-300'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600 px-1">
              <span>0 - Not likely</span>
              <span>10 - Very likely</span>
            </div>
          </div>
        );
      
      default:
        return (
          <Input 
            placeholder="Your answer..."
            value={response || ''}
            onChange={(e) => updateResponse(question.id, e.target.value)}
            className="text-lg p-4 border-0 bg-gray-50 rounded-xl focus:bg-white transition-colors"
          />
        );
    }
  };

  const surveyStyle = {
    backgroundColor: survey?.background_color || '#2f7474',
    color: survey?.text_color || '#ffffff',
  };

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8" style={surveyStyle}>
        <div className="max-w-2xl w-full">
          <Card className="bg-white/95 backdrop-blur shadow-2xl border-0 rounded-3xl">
            <CardContent className="text-center py-16 text-gray-500">
              <p className="text-xl">Add questions to see them in the preview</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

  return (
    <div className="flex items-center justify-center min-h-screen p-8" style={surveyStyle}>
      <div className="max-w-2xl w-full">
        <Card className="bg-white/95 backdrop-blur shadow-2xl border-0 rounded-3xl overflow-hidden">
          {survey?.show_close_button && (
            <div className="flex justify-end p-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </Button>
            </div>
          )}
          
          {/* Progress bar */}
          <div className="px-8 pt-6">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div 
                className="bg-teal-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-500 mb-6">
              Question {currentStep + 1} of {questions.length}
            </div>
          </div>

          <CardHeader className="px-8 pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 leading-tight">
              {currentQuestion.question_text}
              {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="px-8 pb-8 space-y-6">
            {renderQuestion(currentQuestion)}
            
            <div className="flex items-center justify-between pt-6">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              {isLastStep ? (
                <Button 
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-lg rounded-xl"
                  style={{ backgroundColor: survey?.button_color || '#0f766e' }}
                >
                  {survey?.submit_button_text || 'Submit Survey'}
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-lg rounded-xl"
                  style={{ backgroundColor: survey?.button_color || '#0f766e' }}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
