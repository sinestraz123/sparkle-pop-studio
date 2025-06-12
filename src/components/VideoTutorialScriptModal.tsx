
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoTutorialScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoTutorial: any;
}

export const VideoTutorialScriptModal: React.FC<VideoTutorialScriptModalProps> = ({ 
  isOpen, 
  onClose, 
  videoTutorial 
}) => {
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const { toast } = useToast();

  const generateScript = () => {
    const tutorialId = videoTutorial.id;
    
    if (!tutorialId || tutorialId === 'new') {
      return `<!-- Save the video tutorial first to get the actual script -->`;
    }
    
    return `<script>
(function(){
  var s=document.createElement('script');
  s.src='https://qpelvplxusbfyacgipgp.supabase.co/functions/v1/video-tutorial-widget?id=${tutorialId}';
  document.head.appendChild(s);
})();
</script>`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateScript());
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Script copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy script",
        variant: "destructive",
      });
    }
  };

  const testScript = () => {
    if (!videoTutorial.id || videoTutorial.id === 'new') {
      toast({
        title: "Error",
        description: "Save the video tutorial first to test the script",
        variant: "destructive",
      });
      return;
    }

    setTesting(true);
    
    // Remove any existing video tutorial widgets
    const existingWidgets = document.querySelectorAll('[id^="vt-"]');
    existingWidgets.forEach(widget => widget.remove());
    
    // Load the script
    const script = document.createElement('script');
    script.src = `https://qpelvplxusbfyacgipgp.supabase.co/functions/v1/video-tutorial-widget?id=${videoTutorial.id}&test=1`;
    script.onload = () => {
      console.log('Video tutorial widget script loaded for testing');
      setTesting(false);
      toast({
        title: "Test Started",
        description: "Check the preview for your video tutorial widget",
      });
    };
    script.onerror = () => {
      setTesting(false);
      toast({
        title: "Test Failed",
        description: "Failed to load video tutorial widget script",
        variant: "destructive",
      });
    };
    
    document.head.appendChild(script);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Video Tutorial Widget Script</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Embed Script</h4>
              <div className="flex gap-2">
                <Button
                  onClick={testScript}
                  size="sm"
                  variant="outline"
                  disabled={testing || !videoTutorial.id || videoTutorial.id === 'new'}
                  className="bg-green-50 border-green-200 hover:bg-green-100"
                >
                  {testing ? <div className="h-4 w-4 animate-spin border-2 border-green-600 border-t-transparent rounded-full" /> : <Play className="h-4 w-4" />}
                  Test Now
                </Button>
                <Button
                  onClick={handleCopy}
                  size="sm"
                  variant="outline"
                  disabled={!videoTutorial.id || videoTutorial.id === 'new'}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  Copy Script
                </Button>
              </div>
            </div>
            
            <Textarea
              value={generateScript()}
              readOnly
              className="font-mono text-xs min-h-[80px] resize-none bg-gray-50"
            />
            
            <p className="text-xs text-gray-600">
              Add this script before the closing &lt;/body&gt; tag on your website. 
              Users will see a "Video Tutorials" button that opens your tutorial widget.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
