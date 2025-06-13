
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VideoTutorialBuilderPanel } from './video-tutorial-builder/VideoTutorialBuilderPanel';
import { VideoTutorialPreview } from './video-tutorial-builder/VideoTutorialPreview';
import { useVideoTutorials, VideoTutorial } from '@/hooks/useVideoTutorials';

interface VideoTutorialBuilderProps {
  videoTutorialId?: string;
}

export const VideoTutorialBuilder: React.FC<VideoTutorialBuilderProps> = ({ videoTutorialId }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { videoTutorials, isLoading, saveVideoTutorial } = useVideoTutorials();
  const tutorialId = videoTutorialId || id;

  const [videoTutorial, setVideoTutorial] = useState<VideoTutorial>({
    id: tutorialId || 'new',
    title: 'Video Tutorials',
    tutorials: [
      {
        id: '1',
        title: 'How to start a document and build an outline with Glyph AI',
        description: 'Learn how to submit a document prompt and accept an autocomplete',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    ],
    settings: {
      showCloseButton: true,
      autoPlay: false,
      overlay: true
    },
    status: 'draft',
    views: 0
  });

  useEffect(() => {
    if (!isLoading && tutorialId && tutorialId !== 'new') {
      const existingTutorial = videoTutorials.find(t => t.id === tutorialId);
      if (existingTutorial) {
        setVideoTutorial(existingTutorial);
      }
    }
  }, [tutorialId, videoTutorials, isLoading]);

  const handleSave = async () => {
    const savedTutorial = await saveVideoTutorial(videoTutorial);
    if (savedTutorial && tutorialId === 'new') {
      navigate(`/video-tutorials/${savedTutorial.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
        <VideoTutorialBuilderPanel 
          videoTutorial={videoTutorial} 
          onChange={setVideoTutorial}
          onSave={handleSave}
        />
        <VideoTutorialPreview videoTutorial={videoTutorial} />
      </div>
    </div>
  );
};
