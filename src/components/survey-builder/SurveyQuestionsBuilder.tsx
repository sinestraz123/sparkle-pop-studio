
import { useState } from 'react';
import { Plus, GripVertical, Trash2, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useSurveyQuestions } from '@/hooks/useSurveyQuestions';

interface SurveyQuestionsBuilderProps {
  surveyId: string;
  questions: any[];
}

export const SurveyQuestionsBuilder = ({ surveyId, questions }: SurveyQuestionsBuilderProps) => {
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question_text: '',
    question_type: 'text',
    required: false,
    options: [],
  });

  const { addQuestion, deleteQuestion, updateQuestion } = useSurveyQuestions(surveyId);

  const handleAddQuestion = () => {
    if (newQuestion.question_text.trim()) {
      addQuestion({
        ...newQuestion,
        survey_id: surveyId,
        order_index: questions.length,
      });
      setNewQuestion({
        question_text: '',
        question_type: 'text',
        required: false,
        options: [],
      });
      setShowAddQuestion(false);
    }
  };

  const questionTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'textarea', label: 'Long Text' },
    { value: 'radio', label: 'Multiple Choice (Single)' },
    { value: 'checkbox', label: 'Multiple Choice (Multiple)' },
    { value: 'select', label: 'Dropdown' },
    { value: 'rating', label: 'Rating Scale' },
    { value: 'email', label: 'Email' },
    { value: 'number', label: 'Number' },
  ];

  const getQuestionTypeColor = (type: string) => {
    const colors = {
      text: 'bg-blue-100 text-blue-800',
      textarea: 'bg-purple-100 text-purple-800',
      radio: 'bg-green-100 text-green-800',
      checkbox: 'bg-orange-100 text-orange-800',
      select: 'bg-teal-100 text-teal-800',
      rating: 'bg-red-100 text-red-800',
      email: 'bg-indigo-100 text-indigo-800',
      number: 'bg-yellow-100 text-yellow-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Survey Questions</CardTitle>
          <Button 
            onClick={() => setShowAddQuestion(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {questions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No questions added yet. Click "Add Question" to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((question, index) => (
              <div key={question.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border">
                <div className="flex-shrink-0">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-600">Q{index + 1}</span>
                    <Badge className={getQuestionTypeColor(question.question_type)}>
                      {questionTypes.find(t => t.value === question.question_type)?.label}
                    </Badge>
                    {question.required && <Badge variant="outline">Required</Badge>}
                  </div>
                  <p className="text-gray-900 font-medium">{question.question_text}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteQuestion(question.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showAddQuestion && (
          <Card className="border-2 border-teal-200 bg-teal-50">
            <CardHeader>
              <CardTitle className="text-lg">Add New Question</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="question">Question Text</Label>
                <Input
                  id="question"
                  value={newQuestion.question_text}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
                  placeholder="Enter your question..."
                />
              </div>
              <div>
                <Label htmlFor="type">Question Type</Label>
                <Select
                  value={newQuestion.question_type}
                  onValueChange={(value) => setNewQuestion({ ...newQuestion, question_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {questionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="required"
                  checked={newQuestion.required}
                  onCheckedChange={(checked) => setNewQuestion({ ...newQuestion, required: checked })}
                />
                <Label htmlFor="required">Required question</Label>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={handleAddQuestion} className="bg-teal-600 hover:bg-teal-700">
                  Add Question
                </Button>
                <Button variant="outline" onClick={() => setShowAddQuestion(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};
