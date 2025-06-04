
import { useState } from 'react';
import { Plus, Eye, Edit, Trash2, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSurveys } from '@/hooks/useSurveys';
import { useNavigate } from 'react-router-dom';

const Surveys = () => {
  const [newSurveyTitle, setNewSurveyTitle] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { surveys, isLoading, createSurvey, deleteSurvey, isCreating } = useSurveys();
  const navigate = useNavigate();

  const handleCreateSurvey = () => {
    if (newSurveyTitle.trim()) {
      createSurvey(newSurveyTitle.trim());
      setNewSurveyTitle('');
      setShowCreateDialog(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Surveys</h1>
          <p className="text-gray-600 mt-2">Create and manage your surveys to gather valuable feedback.</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Survey
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Survey</DialogTitle>
              <DialogDescription>
                Give your survey a name to get started. You can customize it further in the builder.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Survey Title</Label>
                <Input
                  id="title"
                  value={newSurveyTitle}
                  onChange={(e) => setNewSurveyTitle(e.target.value)}
                  placeholder="Enter survey title..."
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateSurvey()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateSurvey}
                disabled={!newSurveyTitle.trim() || isCreating}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {isCreating ? 'Creating...' : 'Create Survey'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {surveys.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="h-12 w-12 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No surveys yet</h3>
            <p className="text-gray-600 mb-4">Create your first survey to start collecting feedback from your users.</p>
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Survey
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surveys.map((survey) => (
            <Card key={survey.id} className="hover:shadow-lg transition-shadow border border-gray-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                      {survey.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {survey.description || 'No description provided'}
                    </CardDescription>
                  </div>
                  <Badge className={`ml-2 ${getStatusColor(survey.status)}`}>
                    {survey.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Responses: {survey.responses || 0}</span>
                    <span>Views: {survey.views || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/surveys/${survey.id}`)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => deleteSurvey(survey.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Surveys;
