
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, X } from 'lucide-react';

interface SurveyPreviewProps {
  survey: any;
  questions: any[];
}

export const SurveyPreview: React.FC<SurveyPreviewProps> = ({ survey, questions }) => {
  const renderQuestion = (question: any, index: number) => {
    const baseClasses = "mb-4";
    
    switch (question.question_type) {
      case 'text':
      case 'email':
        return (
          <div key={question.id} className={baseClasses}>
            <Label className="text-sm font-medium mb-2 block">
              {question.question_text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input 
              type={question.question_type === 'email' ? 'email' : 'text'}
              placeholder="Your answer..."
              disabled
            />
          </div>
        );
      
      case 'textarea':
        return (
          <div key={question.id} className={baseClasses}>
            <Label className="text-sm font-medium mb-2 block">
              {question.question_text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea placeholder="Your answer..." disabled rows={3} />
          </div>
        );
      
      case 'rating':
        return (
          <div key={question.id} className={baseClasses}>
            <Label className="text-sm font-medium mb-2 block">
              {question.question_text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-6 w-6 text-gray-300 cursor-pointer hover:text-yellow-400" />
              ))}
            </div>
          </div>
        );
      
      default:
        return (
          <div key={question.id} className={baseClasses}>
            <Label className="text-sm font-medium mb-2 block">
              {question.question_text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input placeholder="Your answer..." disabled />
          </div>
        );
    }
  };

  const surveyStyle = {
    backgroundColor: survey?.background_color || '#ffffff',
    color: survey?.text_color || '#000000',
  };

  const buttonStyle = {
    backgroundColor: survey?.button_color || '#3b82f6',
    color: '#ffffff',
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <div className="max-w-md w-full">
        <Card className="shadow-2xl border-0" style={surveyStyle}>
          {survey?.show_close_button && (
            <div className="flex justify-end p-2">
              <Button variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-bold">{survey?.title || 'Survey Title'}</CardTitle>
            {survey?.description && (
              <p className="text-sm opacity-80 mt-2">{survey.description}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Add questions to see them in the preview</p>
              </div>
            ) : (
              questions.map((question, index) => renderQuestion(question, index))
            )}
            
            {questions.length > 0 && (
              <div className="pt-4">
                <Button 
                  className="w-full"
                  style={buttonStyle}
                  disabled
                >
                  {survey?.submit_button_text || 'Submit Survey'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
