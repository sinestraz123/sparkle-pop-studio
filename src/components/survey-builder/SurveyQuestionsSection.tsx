
import React from 'react';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface SurveyQuestion {
  id: string;
  question_text: string;
  question_type: 'text' | 'multiple_choice' | 'rating' | 'yes_no';
  options?: string[];
  required: boolean;
}

interface SurveyQuestionsSectionProps {
  questions: SurveyQuestion[];
  updateQuestion: (questionId: string, field: string, value: any) => void;
  addQuestion: () => void;
  removeQuestion: (questionId: string) => void;
}

export const SurveyQuestionsSection: React.FC<SurveyQuestionsSectionProps> = ({
  questions,
  updateQuestion,
  addQuestion,
  removeQuestion,
}) => {
  const addOption = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const newOptions = [...(question.options || []), 'New option'];
      updateQuestion(questionId, 'options', newOptions);
    }
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = value;
      updateQuestion(questionId, 'options', newOptions);
    }
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options) {
      const newOptions = question.options.filter((_, index) => index !== optionIndex);
      updateQuestion(questionId, 'options', newOptions);
    }
  };

  return (
    <AccordionItem value="questions" className="border rounded-lg px-4">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <MessageSquare className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-left">
            <div className="font-medium">Questions</div>
            <div className="text-sm text-gray-500">{questions.length} question{questions.length !== 1 ? 's' : ''}</div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        {questions.map((question, index) => (
          <div key={question.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Question {index + 1}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeQuestion(question.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Question Text</label>
              <Input
                value={question.question_text}
                onChange={(e) => updateQuestion(question.id, 'question_text', e.target.value)}
                placeholder="Enter your question"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Question Type</label>
              <Select 
                value={question.question_type} 
                onValueChange={(value) => updateQuestion(question.id, 'question_type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                  <SelectItem value="rating">Rating (1-5 stars)</SelectItem>
                  <SelectItem value="yes_no">Yes/No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {question.question_type === 'multiple_choice' && (
              <div>
                <label className="text-sm font-medium mb-2 block">Options</label>
                <div className="space-y-2">
                  {(question.options || []).map((option, optionIndex) => (
                    <div key={optionIndex} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(question.id, optionIndex)}
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addOption(question.id)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Required</label>
              <Switch
                checked={question.required}
                onCheckedChange={(checked) => updateQuestion(question.id, 'required', checked)}
              />
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          onClick={addQuestion}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </AccordionContent>
    </AccordionItem>
  );
};
