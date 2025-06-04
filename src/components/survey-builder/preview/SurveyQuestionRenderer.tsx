
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SurveyQuestionRendererProps {
  question: any;
  index: number;
}

export const SurveyQuestionRenderer = ({ question, index }: SurveyQuestionRendererProps) => {
  const baseClasses = "mb-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100";
  
  const renderQuestionLabel = () => (
    <Label className="text-lg font-semibold mb-4 block text-gray-800">
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
            className="text-lg p-4 border-0 bg-gray-50 rounded-xl"
          />
        </div>
      );
    
    case 'number':
      return (
        <div key={question.id} className={baseClasses}>
          {renderQuestionLabel()}
          <Input 
            type="number" 
            placeholder="0" 
            disabled 
            className="text-lg p-4 border-0 bg-gray-50 rounded-xl"
          />
        </div>
      );
    
    case 'textarea':
      return (
        <div key={question.id} className={baseClasses}>
          {renderQuestionLabel()}
          <Textarea 
            placeholder="Your answer..." 
            disabled 
            rows={4}
            className="text-lg p-4 border-0 bg-gray-50 rounded-xl resize-none"
          />
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
          <RadioGroup disabled className="space-y-3">
            {radioOptions.map((option: any, optIndex: number) => (
              <div key={optIndex} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value={option.value} id={`${question.id}-${optIndex}`} className="text-teal-600" />
                <Label htmlFor={`${question.id}-${optIndex}`} className="text-lg cursor-pointer flex-1">
                  {option.label}
                </Label>
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
          <div className="space-y-3">
            {checkboxOptions.map((option: any, optIndex: number) => (
              <div key={optIndex} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Checkbox id={`${question.id}-${optIndex}`} disabled className="text-teal-600" />
                <Label htmlFor={`${question.id}-${optIndex}`} className="text-lg cursor-pointer flex-1">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      );
    
    case 'select':
      const selectOptions = question.options || [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' }
      ];
      return (
        <div key={question.id} className={baseClasses}>
          {renderQuestionLabel()}
          <Select disabled>
            <SelectTrigger className="text-lg p-4 border-0 bg-gray-50 rounded-xl">
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
        </div>
      );
    
    case 'rating':
      return (
        <div key={question.id} className={baseClasses}>
          {renderQuestionLabel()}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                <button
                  key={rating}
                  disabled
                  className="w-12 h-12 rounded-lg border-2 text-lg font-semibold bg-white text-gray-700 border-gray-200"
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
        </div>
      );
    
    default:
      return (
        <div key={question.id} className={baseClasses}>
          {renderQuestionLabel()}
          <Input 
            placeholder="Your answer..." 
            disabled 
            className="text-lg p-4 border-0 bg-gray-50 rounded-xl"
          />
        </div>
      );
  }
};
