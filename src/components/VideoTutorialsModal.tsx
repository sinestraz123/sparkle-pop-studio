
import React from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail?: string;
}

interface VideoTutorialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorials?: VideoTutorial[];
}

const defaultTutorials: VideoTutorial[] = [
  {
    id: '1',
    title: 'How to start a document and build an outline with Glyph AI',
    description: 'Learn how to submit a document prompt and accept an autocomplete',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: '2',
    title: 'How to use AI Autocomplete to generate suggestions with Glyph AI',
    description: 'Learn how to use the AI Autocomplete feature and related keyboard shortcuts',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: '3',
    title: 'How to improve text with AI Edit',
    description: 'Learn how to use default and custom edit commands to improve text',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: '4',
    title: 'How to automatically generate citations and reference lists with Glyph AI',
    description: 'Find citations to support your arguments and select citation styles',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
];

export const VideoTutorialsModal: React.FC<VideoTutorialsModalProps> = ({
  isOpen,
  onClose,
  tutorials = defaultTutorials,
}) => {
  const [openItems, setOpenItems] = React.useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Video Tutorials</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
          <div className="space-y-4">
            {tutorials.map((tutorial, index) => (
              <Collapsible
                key={tutorial.id}
                open={openItems.includes(tutorial.id)}
                onOpenChange={() => toggleItem(tutorial.id)}
              >
                <CollapsibleTrigger asChild>
                  <div className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 text-left">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {tutorial.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {tutorial.description}
                        </p>
                      </div>
                      <div className="ml-4">
                        {openItems.includes(tutorial.id) ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-4">
                  <div className="bg-white rounded-lg border overflow-hidden">
                    {/* Video Container with Glyph AI branding */}
                    <div className="relative w-full h-80 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
                      {/* Glyph AI Logo/Branding */}
                      <div className="absolute top-4 left-4 z-10">
                        <div className="text-white font-bold text-xl">glyph.ai</div>
                      </div>
                      
                      {/* Video Placeholder - Replace with actual video embed */}
                      <div className="w-full h-full flex items-center justify-center">
                        <iframe
                          width="100%"
                          height="100%"
                          src={tutorial.videoUrl}
                          title={tutorial.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                      
                      {/* Tutorial Label */}
                      <div className="absolute bottom-4 left-4 z-10">
                        <div className="bg-black/50 text-white px-3 py-1 rounded text-sm">
                          //Tutorial
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
