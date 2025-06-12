
import React from 'react';
import { useParams } from 'react-router-dom';
import { VideoTutorialBuilder } from '@/components/VideoTutorialBuilder';
import { VideoTutorialsList } from '@/components/VideoTutorialsList';

const VideoTutorials = () => {
  const { id } = useParams();
  
  if (id) {
    return <VideoTutorialBuilder videoTutorialId={id} />;
  }
  
  return <VideoTutorialsList />;
};

export default VideoTutorials;
