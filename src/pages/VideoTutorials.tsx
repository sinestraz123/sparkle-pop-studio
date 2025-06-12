import { useParams, useNavigate } from 'react-router-dom';
import { VideoTutorialsBuilder } from '@/components/VideoTutorialsBuilder';
import { useVideoTutorialWidgets } from '@/hooks/useVideoTutorialWidgets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';

const VideoTutorials = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { widgets, addWidget, deleteWidget, isLoading } = useVideoTutorialWidgets();

  // If we have an ID, show the builder
  if (id) {
    return (
      <div className="h-screen flex flex-col">
        <VideoTutorialsBuilder />
      </div>
    );
  }

  // Otherwise, show the list of widgets
  const handleCreateWidget = () => {
    addWidget();
    // Navigate to the new widget (for now, use the first widget's ID as mock)
    navigate('/video-tutorials/1');
  };

  const handleEditWidget = (widgetId: string) => {
    navigate(`/video-tutorials/${widgetId}`);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg">Loading video tutorial widgets...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Video Tutorial Widgets</h1>
          <p className="text-gray-600 mt-2">Create interactive video tutorial popups for your website</p>
        </div>
        <Button onClick={handleCreateWidget} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Widget
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets.map((widget) => (
          <Card key={widget.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="truncate">{widget.title}</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditWidget(widget.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteWidget(widget.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">{widget.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{widget.tutorials.length} tutorials</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  widget.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {widget.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <Button 
                className="w-full mt-4" 
                variant="outline"
                onClick={() => handleEditWidget(widget.id)}
              >
                Edit Widget
              </Button>
            </CardContent>
          </Card>
        ))}

        {widgets.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">No video tutorial widgets yet</h3>
                <p className="text-gray-600 mb-4">Create your first widget to get started</p>
                <Button onClick={handleCreateWidget} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Widget
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VideoTutorials;
