
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface QuestionRendererProps {
  question: any;
  response: any;
  onResponse: (value: any) => void;
  textColor: string;
}

export const QuestionRenderer = ({ question, response, onResponse, textColor }: QuestionRendererProps) => {
  if (!question) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No questions added</h3>
        <p className="text-gray-500">Add questions to see them in the preview</p>
      </div>
    );
  }

  switch (question.question_type) {
    case 'multiple_choice':
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium" style={{ color: textColor }}>
            {question.question_text}
          </h3>
          <div className="space-y-3">
            {question.options?.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-3">
                <Checkbox
                  id={`option-${index}`}
                  checked={Array.isArray(response) && response.includes(option)}
                  onCheckedChange={(checked) => {
                    const currentResponses = Array.isArray(response) ? response : [];
                    if (checked) {
                      onResponse([...currentResponses, option]);
                    } else {
                      onResponse(currentResponses.filter((r: string) => r !== option));
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
          <h3 className="text-lg font-medium" style={{ color: textColor }}>
            {question.question_text}
          </h3>
          <RadioGroup
            value={response || ''}
            onValueChange={onResponse}
          >
            {question.options?.map((option: string, index: number) => (
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
          <h3 className="text-lg font-medium" style={{ color: textColor }}>
            {question.question_text}
          </h3>
          <Input
            value={response || ''}
            onChange={(e) => onResponse(e.target.value)}
            placeholder="Type your answer..."
          />
        </div>
      );

    case 'textarea':
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium" style={{ color: textColor }}>
            {question.question_text}
          </h3>
          <Textarea
            value={response || ''}
            onChange={(e) => onResponse(e.target.value)}
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
