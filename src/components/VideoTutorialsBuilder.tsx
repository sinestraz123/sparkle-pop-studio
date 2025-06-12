
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VideoTutorialsBuilderPanel } from '@/components/video-tutorials-builder/VideoTutorialsBuilderPanel';
import { VideoTutorialsPreview } from '@/components/video-tutorials-preview/VideoTutorialsPreview';
import { useVideoTutorialWidgets } from '@/hooks/useVideoTutorialWidgets';

export interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
}

export interface VideoTutorialsConfig {
  id: string;
  title: string;
  description: string;
  tutorials: VideoTutorial[];
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  position: 'bottom-left' | 'bottom-center' | 'bottom-right';
  showCloseButton: boolean;
  triggerButtonText: string;
  isActive: boolean;
}

export const VideoTutorialsBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { widgets, updateWidget, isLoading } = useVideoTutorialWidgets();
  
  const currentWidget = widgets.find(w => w.id === id);

  useEffect(() => {
    if (!isLoading && !currentWidget && id) {
      navigate('/video-tutorials');
    }
  }, [currentWidget, isLoading, id, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg">Loading video tutorial widget...</div>
      </div>
    );
  }

  if (!currentWidget) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg">Video tutorial widget not found</div>
      </div>
    );
  }

  const handleConfigChange = (updates: Partial<VideoTutorialsConfig>) => {
    updateWidget(currentWidget.id, updates);
  };

  const handleTutorialChange = (tutorialId: string, updates: Partial<VideoTutorial>) => {
    const updatedTutorials = currentWidget.tutorials.map(tutorial => 
      tutorial.id === tutorialId ? { ...tutorial, ...updates } : tutorial
    );
    updateWidget(currentWidget.id, { tutorials: updatedTutorials });
  };

  const handleAddTutorial = () => {
    const newTutorialId = Date.now().toString();
    const newTutorial: VideoTutorial = {
      id: newTutorialId,
      title: 'New Tutorial',
      description: 'Tutorial description',
      videoUrl: '',
      duration: '5:00',
    };
    
    const updatedTutorials = [...currentWidget.tutorials, newTutorial];
    updateWidget(currentWidget.id, { tutorials: updatedTutorials });
  };

  const handleDeleteTutorial = (tutorialId: string) => {
    const updatedTutorials = currentWidget.tutorials.filter(tutorial => tutorial.id !== tutorialId);
    updateWidget(currentWidget.id, { tutorials: updatedTutorials });
  };

  return (
    <div className="h-screen flex">
      <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
        <VideoTutorialsBuilderPanel 
          configs={[currentWidget]}
          selectedConfig={currentWidget}
          selectedConfigId={currentWidget.id}
          onConfigChange={handleConfigChange}
          onSelectConfig={() => {}}
          onAddConfig={() => {}}
          onDeleteConfig={() => {}}
          onTutorialChange={handleTutorialChange}
          onAddTutorial={handleAddTutorial}
          onDeleteTutorial={handleDeleteTutorial}
        />
      </div>
      <div className="w-1/2 overflow-y-auto bg-gray-100">
        <VideoTutorialsPreview configs={currentWidget.isActive ? [currentWidget] : []} />
      </div>
    </div>
  );
};
