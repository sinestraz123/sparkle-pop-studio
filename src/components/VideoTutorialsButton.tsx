
import React from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoTutorialsModal } from './VideoTutorialsModal';
import { useVideoTutorials } from '@/hooks/useVideoTutorials';

interface VideoTutorialsButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const VideoTutorialsButton: React.FC<VideoTutorialsButtonProps> = ({
  variant = 'outline',
  size = 'default',
  className,
}) => {
  const { isOpen, openTutorials, closeTutorials } = useVideoTutorials();

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={openTutorials}
        className={`flex items-center gap-2 ${className}`}
      >
        <Play className="h-4 w-4" />
        Video Tutorials
      </Button>

      <VideoTutorialsModal
        isOpen={isOpen}
        onClose={closeTutorials}
      />
    </>
  );
};
