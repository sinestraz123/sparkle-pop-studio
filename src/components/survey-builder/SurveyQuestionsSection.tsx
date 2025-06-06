
import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface Question {
  question_text: string;
  question_type: string;
  options?: string[];
  required: boolean;
}

interface SurveyQuestionsSectionProps {
  questions: Question[];
  onQuestionsChange: (questions: Question[]) => void;
}

export const SurveyQuestionsSection = ({
  questions,
  onQuestionsChange,
}: SurveyQuestionsSectionProps) => {
  const addQuestion = () => {
    const newQuestion: Question = {
      question_text: '',
      question_type: 'single_choice',
      options: ['Option 1', 'Option 2'],
      required: true,
    };
    onQuestionsChange([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], ...updates };
    onQuestionsChange(updatedQuestions);
  };

  const deleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    onQuestionsChange(updatedQuestions);
  };

  const addOption = (questionIndex: number) => {
    const question = questions[questionIndex];
    const newOptions = [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`];
    updateQuestion(questionIndex, { options: newOptions });
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const question = questions[questionIndex];
    const newOptions = [...(question.options || [])];
    newOptions[optionIndex] = value;
    updateQuestion(questionIndex, { options: newOptions });
  };

  const deleteOption = (questionIndex: number, optionIndex: number) => {
    const question = questions[questionIndex];
    const newOptions = (question.options || []).filter((_, i) => i !== optionIndex);
    updateQuestion(questionIndex, { options: newOptions });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Questions</h3>
        <Button onClick={addQuestion} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Question</span>
        </Button>
      </div>

      {questions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No questions added yet. Click "Add Question" to get started.</p>
        </div>
      )}

      <div className="space-y-4">
        {questions.map((question, questionIndex) => (
          <Card key={questionIndex}>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center space-x-2">
                <GripVertical className="h-4 w-4 text-gray-400" />
                <span>Question {questionIndex + 1}</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteQuestion(questionIndex)}
                className="ml-auto h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Question Text</Label>
                  <Textarea
                    value={question.question_text}
                    onChange={(e) => updateQuestion(questionIndex, { question_text: e.target.value })}
                    placeholder="Enter your question..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Question Type</Label>
                  <Select
                    value={question.question_type}
                    onValueChange={(value) => updateQuestion(questionIndex, { question_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single_choice">Single Choice</SelectItem>
                      <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                      <SelectItem value="text_input">Text Input</SelectItem>
                      <SelectItem value="textarea">Long Text</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {(question.question_type === 'single_choice' || question.question_type === 'multiple_choice') && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Options</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addOption(questionIndex)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Option
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {question.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                        {(question.options?.length || 0) > 2 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteOption(questionIndex, optionIndex)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`required-${questionIndex}`}
                  checked={question.required}
                  onCheckedChange={(checked) => updateQuestion(questionIndex, { required: !!checked })}
                />
                <Label htmlFor={`required-${questionIndex}`} className="text-sm">
                  Required question
                </Label>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
