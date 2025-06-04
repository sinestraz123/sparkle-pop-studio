
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSurvey } from '@/hooks/useSurveys';
import { SurveyQuestionsBuilder } from '@/components/survey-builder/SurveyQuestionsBuilder';
import { SurveySettingsPanel } from '@/components/survey-builder/SurveySettingsPanel';
import { SurveyPreviewPanel } from '@/components/survey-builder/SurveyPreviewPanel';

const SurveyBuilder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { survey, questions, isLoading, updateSurvey } = useSurvey(id!);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Update local state when survey data loads
  useState(() => {
    if (survey) {
      setTitle(survey.title || '');
      setDescription(survey.description || '');
    }
  }, [survey]);

  const handleSave = () => {
    updateSurvey({
      title,
      description,
    });
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

  if (!survey) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Survey not found</h2>
          <p className="text-gray-600 mb-4">The survey you're looking for doesn't exist or you don't have permission to access it.</p>
          <Button onClick={() => navigate('/surveys')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Surveys
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/surveys')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Surveys
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{survey.title}</h1>
                <p className="text-sm text-gray-600">Survey Builder</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="text-gray-600">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <Tabs defaultValue="build" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="build">Build</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="build" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Survey Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Survey Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Survey Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter survey title..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter survey description..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <SurveyQuestionsBuilder surveyId={id!} questions={questions} />
              </div>

              {/* Quick Settings Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Survey Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview Survey
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <SurveySettingsPanel survey={survey} onUpdate={updateSurvey} />
          </TabsContent>

          <TabsContent value="preview">
            <SurveyPreviewPanel survey={survey} questions={questions} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SurveyBuilder;
