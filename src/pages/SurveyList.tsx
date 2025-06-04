import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Users, BarChart3, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSurveys } from '@/hooks/useSurveys';
import { useToast } from '@/hooks/use-toast';

export default function SurveyList() {
  const navigate = useNavigate();
  const { surveys, isLoading, createSurvey, deleteSurvey, isCreating, isDeleting } = useSurveys();
  const { toast } = useToast();

  const handleCreateSurvey = async () => {
    try {
      const newSurvey = {
        title: 'New Survey',
        description: 'Help us improve by sharing your thoughts',
        type: 'modal',
        position: 'center',
        background_color: '#ffffff',
        text_color: '#000000',
        button_color: '#3b82f6',
        submit_button_text: 'Submit',
        show_close_button: true,
        auto_show: false,
        delay: 0,
        status: 'draft',
      };

      createSurvey(newSurvey);
    } catch (error) {
      console.error('Error creating survey:', error);
      toast({
        title: 'Error',
        description: 'Failed to create survey. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteSurvey = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        deleteSurvey(id);
      } catch (error) {
        console.error('Error deleting survey:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Surveys</h1>
          <p className="text-gray-600 mt-2">Create and manage customer feedback surveys</p>
        </div>
        <Button 
          onClick={handleCreateSurvey}
          disabled={isCreating}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Survey
        </Button>
      </div>

      {surveys.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BarChart3 className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No surveys yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create your first survey to start collecting valuable feedback from your users.
            </p>
            <Button 
              onClick={handleCreateSurvey}
              disabled={isCreating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Survey
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {surveys.map((survey) => (
            <Card key={survey.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                      {survey.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {survey.description}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={survey.status === 'active' ? 'default' : 'secondary'}
                    className="ml-2"
                  >
                    {survey.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Eye className="h-4 w-4 mr-2" />
                      {survey.views || 0} views
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {survey.responses || 0} responses
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/survey/${survey.id}`)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSurvey(survey.id, survey.title);
                      }}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
}
