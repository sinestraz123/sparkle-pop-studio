
import React, { useState } from 'react';
import { VideoTutorialBuilderPanel } from './video-tutorial-builder/VideoTutorialBuilderPanel';
import { VideoTutorialPreview } from './video-tutorial-builder/VideoTutorialPreview';

interface VideoTutorialBuilderProps {
  videoTutorialId?: string;
}

export const VideoTutorialBuilder: React.FC<VideoTutorialBuilderProps> = ({ videoTutorialId }) => {
  const [videoTutorial, setVideoTutorial] = useState({
    id: videoTutorialId || 'new',
    title: 'Video Tutorials',
    tutorials: [
      {
        id: '1',
        title: 'How to start a document and build an outline with Glyph AI',
        description: 'Learn how to submit a document prompt and accept an autocomplete',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: '/lovable-uploads/e293bdc9-e9c6-46f1-90de-22091dcfeb12.png'
      }
    ],
    settings: {
      showCloseButton: true,
      autoPlay: false,
      position: 'center',
      overlay: true
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
        <VideoTutorialBuilderPanel 
          videoTutorial={videoTutorial} 
          onChange={setVideoTutorial} 
        />
        <VideoTutorialPreview videoTutorial={videoTutorial} />
      </div>
    </div>
  );
};
