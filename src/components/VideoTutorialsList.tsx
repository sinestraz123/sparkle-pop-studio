
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Video, Eye, Settings, Trash2 } from 'lucide-react';
import { useVideoTutorials } from '@/hooks/useVideoTutorials';

export const VideoTutorialsList: React.FC = () => {
  const { videoTutorials, isLoading, deleteVideoTutorial } = useVideoTutorials();

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg mt-4 text-muted-foreground">Loading video tutorials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Video Tutorials</h1>
          <p className="text-muted-foreground mt-1">Create and manage interactive video tutorial widgets</p>
        </div>
        <Link to="/video-tutorials/new">
          <Button className="bg-black hover:bg-gray-800">
            <Plus className="h-4 w-4 mr-2" />
            New Video Tutorial Widget
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videoTutorials.map((widget) => (
          <Card key={widget.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle className="text-lg">{widget.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {widget.tutorials.length} tutorial{widget.tutorials.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  widget.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {widget.status}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>{widget.tutorials.length} tutorials</span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {widget.views} views
                </span>
              </div>
              <div className="flex gap-2">
                <Link to={`/video-tutorials/${widget.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => deleteVideoTutorial(widget.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {videoTutorials.length === 0 && (
        <div className="text-center py-12">
          <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No video tutorial widgets yet</h3>
          <p className="text-muted-foreground mb-4">Create your first video tutorial widget to help users learn about your product.</p>
          <Link to="/video-tutorials/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Video Tutorial Widget
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
