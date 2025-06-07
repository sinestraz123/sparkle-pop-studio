
import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FileVideo } from 'lucide-react';

interface SpotlightContentSectionProps {
  title: string;
  videoUrl: string;
  onTitleChange: (title: string) => void;
  onVideoUrlChange: (url: string) => void;
}

export const SpotlightContentSection: React.FC<SpotlightContentSectionProps> = ({
  title,
  videoUrl,
  onTitleChange,
  onVideoUrlChange,
}) => {
  return (
    <AccordionItem value="content">
      <AccordionTrigger className="flex items-center">
        <div className="flex items-center space-x-2">
          <FileVideo className="h-4 w-4" />
          <span>Content</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="title">Spotlight Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter a compelling title for your video spotlight"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="video-url">Video URL</Label>
          <Input
            id="video-url"
            value={videoUrl}
            onChange={(e) => onVideoUrlChange(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=... or direct video URL"
          />
          <p className="text-xs text-gray-500">
            Supports YouTube, Vimeo, and direct video URLs
          </p>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
