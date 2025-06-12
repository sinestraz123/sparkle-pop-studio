
import { useState } from 'react';
import { X, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { VideoTutorialsConfig } from '@/components/VideoTutorialsBuilder';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface VideoTutorialWidgetProps {
  config: VideoTutorialsConfig;
}

export const VideoTutorialWidget = ({ config }: VideoTutorialWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  if (!isOpen) {
    const getPositionClasses = () => {
      switch (config.position) {
        case 'bottom-left':
          return 'bottom-6 left-6';
        case 'bottom-right':
          return 'bottom-6 right-6';
        default:
          return 'bottom-6 left-1/2 transform -translate-x-1/2';
      }
    };

    return (
      <div className={`absolute ${getPositionClasses()} z-50`}>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all hover:scale-105"
          style={{ 
            backgroundColor: config.buttonColor, 
            color: config.textColor 
          }}
        >
          <Play className="h-4 w-4" />
          {config.triggerButtonText}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div 
        className="w-full max-w-4xl h-full max-h-[80vh] rounded-lg shadow-2xl overflow-hidden"
        style={{ backgroundColor: config.backgroundColor }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: config.textColor }}>
                {config.title}
              </h2>
              <p className="text-sm opacity-80" style={{ color: config.textColor }}>
                {config.description}
              </p>
            </div>
            {config.showCloseButton && (
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-black/10 transition-colors"
              >
                <X className="h-5 w-5" style={{ color: config.textColor }} />
              </button>
            )}
          </div>
        </div>

        <div className="flex h-full">
          {/* Video Player */}
          <div className="flex-1 p-6">
            {selectedVideo ? (
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={selectedVideo}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  title="Tutorial Video"
                />
              </div>
            ) : (
              <div 
                className="aspect-video rounded-lg flex items-center justify-center border-2 border-dashed"
                style={{ borderColor: config.textColor + '40' }}
              >
                <div className="text-center">
                  <Play className="h-12 w-12 mx-auto mb-4 opacity-50" style={{ color: config.textColor }} />
                  <p className="opacity-60" style={{ color: config.textColor }}>
                    Select a tutorial to start watching
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Tutorial List */}
          <div className="w-80 border-l border-gray-200/20 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold mb-4" style={{ color: config.textColor }}>
                Tutorials ({config.tutorials.length})
              </h3>
              
              <Accordion type="single" collapsible className="space-y-2">
                {config.tutorials.map((tutorial, index) => (
                  <AccordionItem 
                    key={tutorial.id} 
                    value={tutorial.id}
                    className="border rounded-lg"
                    style={{ borderColor: config.textColor + '20' }}
                  >
                    <AccordionTrigger 
                      className="hover:no-underline px-4 py-3"
                      onClick={() => setSelectedVideo(tutorial.videoUrl)}
                    >
                      <div className="flex items-start gap-3 text-left">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate" style={{ color: config.textColor }}>
                            {tutorial.title}
                          </div>
                          <div className="text-xs opacity-60" style={{ color: config.textColor }}>
                            {tutorial.duration}
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-3">
                      <p className="text-sm opacity-80" style={{ color: config.textColor }}>
                        {tutorial.description}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
