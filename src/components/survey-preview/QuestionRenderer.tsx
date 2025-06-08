
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
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
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: textColor }}>
              {question.question_text}
            </h3>
            {question.description && (
              <p className="text-sm text-gray-600 mb-4">{question.description}</p>
            )}
            <p className="text-sm text-gray-500 italic mb-4">Select all that apply:</p>
          </div>
          <div className="space-y-3">
            {question.options?.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => {
                  const currentResponses = Array.isArray(response) ? response : [];
                  if (currentResponses.includes(option)) {
                    onResponse(currentResponses.filter((r: string) => r !== option));
                  } else {
                    onResponse([...currentResponses, option]);
                  }
                }}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 ${
                  Array.isArray(response) && response.includes(option)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-sm font-medium">{option}</span>
              </button>
            ))}
          </div>
        </div>
      );

    case 'single_choice':
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: textColor }}>
              {question.question_text}
            </h3>
            {question.description && (
              <p className="text-sm text-gray-600 mb-4">{question.description}</p>
            )}
          </div>
          <div className="space-y-3">
            {question.options?.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => onResponse(option)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 ${
                  response === option
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-sm font-medium">{option}</span>
              </button>
            ))}
          </div>
        </div>
      );

    case 'text_input':
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: textColor }}>
              {question.question_text}
            </h3>
            {question.description && (
              <p className="text-sm text-gray-600 mb-4">{question.description}</p>
            )}
          </div>
          <Input
            value={response || ''}
            onChange={(e) => onResponse(e.target.value)}
            placeholder="Type your answer..."
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
      );

    case 'textarea':
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: textColor }}>
              {question.question_text}
            </h3>
            {question.description && (
              <p className="text-sm text-gray-600 mb-4">{question.description}</p>
            )}
          </div>
          <Textarea
            value={response || ''}
            onChange={(e) => onResponse(e.target.value)}
            placeholder="Type your answer..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
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
