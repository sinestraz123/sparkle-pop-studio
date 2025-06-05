
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: any;
}

export const ScriptModal: React.FC<ScriptModalProps> = ({ isOpen, onClose, announcement }) => {
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const { toast } = useToast();

  const generateScript = () => {
    const announcementId = announcement.id;
    
    if (!announcementId) {
      return `<!-- Save the announcement first to get the actual script -->`;
    }
    
    return `<script>
(function(){
  var s=document.createElement('script');
  s.src='https://qpelvplxusbfyacgipgp.supabase.co/functions/v1/widget-loader?id=${announcementId}';
  s.onerror=function(){console.error('Widget: Failed to load script');};
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
    if (!announcement.id) {
      toast({
        title: "Error",
        description: "Save the announcement first to test the script",
        variant: "destructive",
      });
      return;
    }

    setTesting(true);
    
    // Remove any existing widgets first
    const existingWidgets = document.querySelectorAll('[id^="aw-overlay-"]');
    existingWidgets.forEach(widget => widget.remove());
    
    // Remove existing scripts
    const existingScripts = document.querySelectorAll('script[src*="widget-loader"]');
    existingScripts.forEach(script => script.remove());
    
    // Clear widget flags
    Object.keys(window).forEach(key => {
      if (key.startsWith('aw_loaded_')) {
        delete window[key];
      }
    });
    
    console.log('Testing widget for announcement:', announcement.id);
    
    // Load the script
    const script = document.createElement('script');
    script.src = `https://qpelvplxusbfyacgipgp.supabase.co/functions/v1/widget-loader?id=${announcement.id}&test=1`;
    script.onload = () => {
      console.log('Widget script loaded for testing');
      setTesting(false);
      toast({
        title: "Test Started",
        description: "The widget should appear in 1 second. Check your browser console for debugging info.",
      });
    };
    script.onerror = () => {
      setTesting(false);
      console.error('Failed to load widget script');
      toast({
        title: "Test Failed",
        description: "Failed to load widget script. Check browser console for errors.",
        variant: "destructive",
      });
    };
    
    document.head.appendChild(script);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Widget Script</DialogTitle>
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
                  disabled={testing || !announcement.id}
                  className="bg-green-50 border-green-200 hover:bg-green-100"
                >
                  {testing ? <div className="h-4 w-4 animate-spin border-2 border-green-600 border-t-transparent rounded-full" /> : <Play className="h-4 w-4" />}
                  Test Now
                </Button>
                <Button
                  onClick={handleCopy}
                  size="sm"
                  variant="outline"
                  disabled={!announcement.id}
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
              Add this script before the closing &lt;/body&gt; tag on your website
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
