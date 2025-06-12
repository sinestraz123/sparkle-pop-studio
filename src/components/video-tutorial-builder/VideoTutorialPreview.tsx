
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ChevronDown, ChevronUp, Play } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface VideoTutorialPreviewProps {
  videoTutorial: any;
}

export const VideoTutorialPreview: React.FC<VideoTutorialPreviewProps> = ({ videoTutorial }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);

  // Always start with the first video expanded
  useEffect(() => {
    if (videoTutorial.tutorials && videoTutorial.tutorials.length > 0) {
      setExpandedVideo(videoTutorial.tutorials[0].id);
    }
  }, [videoTutorial.tutorials]);

  if (!isVisible) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <Button onClick={() => setIsVisible(true)}>Show Preview</Button>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 flex items-center justify-center p-6">
      <div className="relative">
        {videoTutorial.settings.overlay && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
        )}
        
        <Card className="w-full max-w-xl max-h-[70vh] overflow-hidden z-50 relative">
          <div className="border-b px-6 py-3 bg-background">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Video Tutorials</h3>
              {videoTutorial.settings.showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <CardContent className="p-0 max-h-96 overflow-y-auto">
            <Accordion type="single" collapsible value={expandedVideo || undefined} onValueChange={setExpandedVideo}>
              {videoTutorial.tutorials.map((tutorial: any, index: number) => (
                <AccordionItem key={tutorial.id} value={tutorial.id} className="border-b last:border-b-0">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                    <div className="flex items-start gap-3 text-left w-full">
                      <div className="flex-shrink-0 mt-1">
                        {expandedVideo === tutorial.id ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        }
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{tutorial.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{tutorial.description}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    {tutorial.videoUrl ? (
                      <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg overflow-hidden relative">
                        <iframe
                          src={tutorial.videoUrl + (videoTutorial.settings.autoPlay ? '?autoplay=1' : '')}
                          title={tutorial.title}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                        {!tutorial.videoUrl.includes('youtube') && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white bg-opacity-20 rounded-full p-4">
                              <Play className="h-8 w-8 text-white" />
                            </div>
                            <div className="absolute bottom-4 left-4 text-white">
                              <div className="text-2xl font-bold">glyph.ai</div>
                              <div className="text-sm opacity-80">//Tutorial</div>
                              <div className="text-xl font-semibold mt-2">Start a New Document</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white rounded-full"></div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white rounded-full"></div>
                        </div>
                        <div className="text-center text-white z-10">
                          <div className="bg-white bg-opacity-20 rounded-full p-4 mb-4 inline-flex">
                            <Play className="h-8 w-8" />
                          </div>
                          <div className="space-y-2">
                            <div className="text-2xl font-bold">glyph.ai</div>
                            <div className="text-sm opacity-80">//Tutorial</div>
                            <div className="text-xl font-semibold">Start a New Document</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
