
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check, Play, AlertTriangle } from 'lucide-react';
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
    const announcementId = announcement.id || 'YOUR_ANNOUNCEMENT_ID';
    
    return `<script>
(function(){
  var s=document.createElement('script');
  s.src='https://qpelvplxusbfyacgipgp.supabase.co/functions/v1/widget-loader?id=${announcementId}';
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
    
    // Remove any existing widget
    const existingWidgets = document.querySelectorAll('[id^="aw-"]');
    existingWidgets.forEach(widget => widget.remove());
    
    // Load the script
    const script = document.createElement('script');
    script.src = `https://qpelvplxusbfyacgipgp.supabase.co/functions/v1/widget-loader?id=${announcement.id}&test=1`;
    script.onload = () => {
      console.log('Widget script loaded for testing');
      setTesting(false);
      toast({
        title: "Test Started",
        description: "Check the preview for your announcement widget",
      });
    };
    script.onerror = () => {
      setTesting(false);
      toast({
        title: "Test Failed",
        description: "Failed to load widget script",
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
          {!announcement.id && (
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-800 font-medium">
                  Save this announcement first to get the actual script
                </p>
              </div>
            </div>
          )}

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
