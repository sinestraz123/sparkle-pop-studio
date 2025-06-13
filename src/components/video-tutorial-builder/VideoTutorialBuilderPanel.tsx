
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Video, Save, Code } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { VideoTutorialScriptModal } from '../VideoTutorialScriptModal';
import { VideoTutorial } from '@/hooks/useVideoTutorials';

interface VideoTutorialBuilderPanelProps {
  videoTutorial: VideoTutorial;
  onChange: (videoTutorial: VideoTutorial) => void;
  onSave: () => void;
}

export const VideoTutorialBuilderPanel: React.FC<VideoTutorialBuilderPanelProps> = ({
  videoTutorial,
  onChange,
  onSave
}) => {
  const [isScriptModalOpen, setIsScriptModalOpen] = useState(false);

  const updateTutorial = (index: number, field: string, value: string) => {
    const updatedTutorials = [...videoTutorial.tutorials];
    updatedTutorials[index] = { ...updatedTutorials[index], [field]: value };
    onChange({ ...videoTutorial, tutorials: updatedTutorials });
  };

  const addTutorial = () => {
    const newTutorial = {
      id: crypto.randomUUID(), // Generate proper UUID
      title: 'New Tutorial',
      description: 'Tutorial description',
      videoUrl: '',
      thumbnail: ''
    };
    onChange({
      ...videoTutorial,
      tutorials: [...videoTutorial.tutorials, newTutorial]
    });
  };

  const removeTutorial = (index: number) => {
    const updatedTutorials = videoTutorial.tutorials.filter((_: any, i: number) => i !== index);
    onChange({ ...videoTutorial, tutorials: updatedTutorials });
  };

  const updateSettings = (field: string, value: any) => {
    onChange({
      ...videoTutorial,
      settings: { ...videoTutorial.settings, [field]: value }
    });
  };

  // Function to convert YouTube watch URL to embed URL
  const convertToEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Check if it's already an embed URL
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    
    // Convert youtube.com/watch?v= to embed format
    const watchMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
    if (watchMatch) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }
    
    // Convert youtu.be/ to embed format
    const shortMatch = url.match(/youtu\.be\/([^?]+)/);
    if (shortMatch) {
      return `https://www.youtube.com/embed/${shortMatch[1]}`;
    }
    
    return url;
  };

  return (
    <div className="h-full overflow-y-auto border-r bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Video Tutorial Builder</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setIsScriptModalOpen(true)}
            >
              <Code className="h-4 w-4 mr-2" />
              Get Script
            </Button>
            <Button onClick={onSave} className="bg-black hover:bg-gray-800">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Widget Title</Label>
              <Input
                id="title"
                value={videoTutorial.title}
                onChange={(e) => onChange({ ...videoTutorial, title: e.target.value })}
                placeholder="Enter widget title"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tutorials */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Video Tutorials</CardTitle>
              <Button onClick={addTutorial} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Tutorial
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-2">
              {videoTutorial.tutorials.map((tutorial: any, index: number) => (
                <AccordionItem key={tutorial.id} value={`tutorial-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      <span>{tutorial.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div>
                      <Label>Tutorial Title</Label>
                      <Input
                        value={tutorial.title}
                        onChange={(e) => updateTutorial(index, 'title', e.target.value)}
                        placeholder="Enter tutorial title"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={tutorial.description}
                        onChange={(e) => updateTutorial(index, 'description', e.target.value)}
                        placeholder="Enter tutorial description"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>YouTube Video URL</Label>
                      <Input
                        value={tutorial.videoUrl}
                        onChange={(e) => {
                          const embedUrl = convertToEmbedUrl(e.target.value);
                          updateTutorial(index, 'videoUrl', embedUrl);
                        }}
                        placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Paste any YouTube URL - it will be automatically converted to embed format
                      </p>
                    </div>
                    <div>
                      <Label>Thumbnail URL (Optional)</Label>
                      <Input
                        value={tutorial.thumbnail || ''}
                        onChange={(e) => updateTutorial(index, 'thumbnail', e.target.value)}
                        placeholder="https://example.com/thumbnail.jpg"
                      />
                    </div>
                    <Button
                      onClick={() => removeTutorial(index)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Tutorial
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Display Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="closeButton">Show Close Button</Label>
              <Switch
                id="closeButton"
                checked={videoTutorial.settings.showCloseButton}
                onCheckedChange={(checked) => updateSettings('showCloseButton', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="autoPlay">Auto Play Videos</Label>
              <Switch
                id="autoPlay"
                checked={videoTutorial.settings.autoPlay}
                onCheckedChange={(checked) => updateSettings('autoPlay', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="overlay">Show Overlay</Label>
              <Switch
                id="overlay"
                checked={videoTutorial.settings.overlay}
                onCheckedChange={(checked) => updateSettings('overlay', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <VideoTutorialScriptModal 
        isOpen={isScriptModalOpen}
        onClose={() => setIsScriptModalOpen(false)}
        videoTutorial={videoTutorial}
      />
    </div>
  );
};
