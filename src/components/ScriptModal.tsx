
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: any;
}

export const ScriptModal: React.FC<ScriptModalProps> = ({ isOpen, onClose, announcement }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateScript = () => {
    // Use the actual announcement ID if editing existing, or generate a placeholder for new ones
    const announcementId = announcement.id || 'YOUR_ANNOUNCEMENT_ID';
    
    return `<!-- Announcement Widget - Paste before closing </body> tag -->
<script>
(function(w,d,s,id){
  if(w['aw_'+id]) return;
  w['aw_'+id]=1;
  var js=d.createElement(s);
  js.async=1;
  js.src='https://qpelvplxusbfyacgipgp.supabase.co/functions/v1/widget-loader?id='+id;
  d.head.appendChild(js);
})(window,document,'script','${announcementId}');
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Announcement Widget Script</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            This lightweight script (similar to Intercom) dynamically loads your announcement widget. 
            Paste it before the closing &lt;/body&gt; tag on your website.
          </p>
          
          <div className="relative">
            <Textarea
              value={generateScript()}
              readOnly
              className="font-mono text-xs min-h-[200px] resize-none"
            />
            <Button
              onClick={handleCopy}
              size="sm"
              className="absolute top-2 right-2"
              variant="outline"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <h4 className="font-medium text-green-900 mb-1">✨ How it works (like Intercom):</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• <strong>Tiny bootstrap</strong> - Only ~200 bytes initial load</li>
              <li>• <strong>Async loading</strong> - Doesn't block your page</li>
              <li>• <strong>Live updates</strong> - Changes reflect instantly</li>
              <li>• <strong>Analytics tracking</strong> - Views and clicks tracked automatically</li>
              <li>• <strong>Smart caching</strong> - Optimized for performance</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-1">Manual Control:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Call <code className="bg-blue-100 px-1 rounded">showAnnouncement()</code> to trigger manually</li>
              <li>• Call <code className="bg-blue-100 px-1 rounded">refreshAnnouncement()</code> to reload with latest data</li>
            </ul>
          </div>

          {!announcement.id && (
            <div className="bg-amber-50 p-3 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Save this announcement first to get the actual widget script with the correct ID.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
