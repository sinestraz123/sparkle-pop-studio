
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star } from 'lucide-react';

interface SurveyQuestionRendererProps {
  question: any;
  index: number;
}

export const SurveyQuestionRenderer = ({ question, index }: SurveyQuestionRendererProps) => {
  const baseClasses = "mb-4";
  
  const renderQuestionLabel = () => (
    <Label className="text-sm font-medium mb-2 block">
      Q{index + 1}. {question.question_text}
      {question.required && <span className="text-red-500 ml-1">*</span>}
    </Label>
  );

  switch (question.question_type) {
    case 'text':
    case 'email':
      return (
        <div key={question.id} className={baseClasses}>
          {renderQuestionLabel()}
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
          {renderQuestionLabel()}
          <Input type="number" placeholder="0" disabled />
        </div>
      );
    
    case 'textarea':
      return (
        <div key={question.id} className={baseClasses}>
          {renderQuestionLabel()}
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
          {renderQuestionLabel()}
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
          {renderQuestionLabel()}
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
          {renderQuestionLabel()}
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
          {renderQuestionLabel()}
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
          {renderQuestionLabel()}
          <Input placeholder="Your answer..." disabled />
        </div>
      );
  }
};
