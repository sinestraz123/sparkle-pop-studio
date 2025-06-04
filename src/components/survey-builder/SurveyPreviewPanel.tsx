
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star } from 'lucide-react';

interface SurveyPreviewPanelProps {
  survey: any;
  questions: any[];
}

export const SurveyPreviewPanel = ({ survey, questions }: SurveyPreviewPanelProps) => {
  const renderQuestion = (question: any, index: number) => {
    const baseClasses = "mb-4";
    
    switch (question.question_type) {
      case 'text':
      case 'email':
        return (
          <div key={question.id} className={baseClasses}>
            <Label className="text-sm font-medium mb-2 block">
              Q{index + 1}. {question.question_text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input 
              type={question.question_type === 'email' ? 'email' : 'text'}
              placeholder="Your answer..."
              disabled
            />
          </div>
        );
      
      case 'number':
        return (
          <div key={question.id} className={baseClasses}>
            <Label className="text-sm font-medium mb-2 block">
              Q{index + 1}. {question.question_text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input type="number" placeholder="0" disabled />
          </div>
        );
      
      case 'textarea':
        return (
          <div key={question.id} className={baseClasses}>
            <Label className="text-sm font-medium mb-2 block">
              Q{index + 1}. {question.question_text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea placeholder="Your answer..." disabled rows={3} />
          </div>
        );
      
      case 'radio':
        const radioOptions = question.options || [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' }
        ];
        return (
          <div key={question.id} className={baseClasses}>
            <Label className="text-sm font-medium mb-2 block">
              Q{index + 1}. {question.question_text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <RadioGroup disabled className="space-y-2">
              {radioOptions.map((option: any, optIndex: number) => (
                <div key={optIndex} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${question.id}-${optIndex}`} />
                  <Label htmlFor={`${question.id}-${optIndex}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      
      case 'checkbox':
        const checkboxOptions = question.options || [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' }
        ];
        return (
          <div key={question.id} className={baseClasses}>
            <Label className="text-sm font-medium mb-2 block">
              Q{index + 1}. {question.question_text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="space-y-2">
              {checkboxOptions.map((option: any, optIndex: number) => (
                <div key={optIndex} className="flex items-center space-x-2">
                  <Checkbox id={`${question.id}-${optIndex}`} disabled />
                  <Label htmlFor={`${question.id}-${optIndex}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'select':
        const selectOptions = question.options || [
          { label: 'Select an option...', value: '' },
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' }
        ];
        return (
          <div key={question.id} className={baseClasses}>
            <Label className="text-sm font-medium mb-2 block">
              Q{index + 1}. {question.question_text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder="Select an option..." />
              </SelectTrigger>
              <SelectContent>
                {selectOptions.map((option: any, optIndex: number) => (
                  <SelectItem key={optIndex} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      
      case 'rating':
        return (
          <div key={question.id} className={baseClasses}>
            <Label className="text-sm font-medium mb-2 block">
              Q{index + 1}. {question.question_text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-6 w-6 text-gray-300 cursor-pointer hover:text-yellow-400" />
              ))}
              <span className="ml-2 text-sm text-gray-500">Click to rate</span>
            </div>
          </div>
        );
      
      default:
        return (
          <div key={question.id} className={baseClasses}>
            <Label className="text-sm font-medium mb-2 block">
              Q{index + 1}. {question.question_text}
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
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Survey Preview</h3>
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
              questions.map((question, index) => renderQuestion(question, index))
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
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Survey Information</h3>
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
      </div>
    </div>
  );
};
