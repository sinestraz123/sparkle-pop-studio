
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check, Shield, Zap, Globe } from 'lucide-react';
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
    const announcementId = announcement.id || 'YOUR_ANNOUNCEMENT_ID';
    
    return `<!-- Likemetric Announcement Widget - Production Ready -->
<script>
(function(w,d,s,id){
  if(w['aw_'+id]) return;
  w['aw_'+id]=1;
  var js=d.createElement(s);
  js.async=1;
  js.crossOrigin='anonymous';
  js.src='https://qpelvplxusbfyacgipgp.supabase.co/functions/v1/widget-loader?id='+id;
  js.onerror=function(){console.warn('Announcement widget failed to load')};
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
        description: "Production-ready script copied to clipboard",
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Production-Ready Widget Script
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">
              🚀 This script is now production-ready with enterprise-grade features
            </p>
            <p className="text-xs text-blue-700">
              Paste this lightweight script before the closing &lt;/body&gt; tag on your website.
            </p>
          </div>
          
          <div className="relative">
            <Textarea
              value={generateScript()}
              readOnly
              className="font-mono text-xs min-h-[120px] resize-none bg-gray-50"
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

          {/* Production Features Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-green-600" />
                <h4 className="font-medium text-green-900">Security</h4>
              </div>
              <ul className="text-xs text-green-800 space-y-1">
                <li>• XSS protection & HTML sanitization</li>
                <li>• Input validation & URL verification</li>
                <li>• CSP headers & secure loading</li>
                <li>• Prevents multiple instances</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium text-blue-900">Performance</h4>
              </div>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• ~200 bytes initial load</li>
                <li>• Throttled scroll tracking</li>
                <li>• Enhanced caching strategy</li>
                <li>• Lazy loading for media</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-purple-600" />
                <h4 className="font-medium text-purple-900">UX & Accessibility</h4>
              </div>
              <ul className="text-xs text-purple-800 space-y-1">
                <li>• ARIA labels & focus management</li>
                <li>• Keyboard navigation support</li>
                <li>• Mobile responsive design</li>
                <li>• Smooth animations & transitions</li>
              </ul>
            </div>
          </div>

          {/* Advanced Features */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">🛠️ Advanced Features</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-gray-800 mb-1">Error Handling</h5>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Automatic retry logic for failed requests</li>
                  <li>• Graceful degradation on errors</li>
                  <li>• Silent analytics failures</li>
                  <li>• Console warnings for debugging</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-800 mb-1">Smart Triggers</h5>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Exit intent detection</li>
                  <li>• Time-based triggers</li>
                  <li>• Scroll percentage tracking</li>
                  <li>• Manual trigger functions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Manual Control */}
          <div className="bg-amber-50 p-4 rounded-lg">
            <h4 className="font-medium text-amber-900 mb-2">🎛️ Manual Control</h4>
            <div className="grid md:grid-cols-2 gap-4 text-xs text-amber-800">
              <div>
                <strong>Trigger manually:</strong>
                <code className="block bg-amber-100 p-1 rounded mt-1">showAnnouncement()</code>
              </div>
              <div>
                <strong>Refresh with latest data:</strong>
                <code className="block bg-amber-100 p-1 rounded mt-1">refreshAnnouncement()</code>
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-medium text-indigo-900 mb-2">📊 Analytics & Tracking</h4>
            <ul className="text-xs text-indigo-800 space-y-1">
              <li>• <strong>Views</strong> - Automatically tracked when widget loads</li>
              <li>• <strong>Clicks</strong> - Tracked with retry logic for reliability</li>
              <li>• <strong>Engagement</strong> - Scroll and time tracking</li>
              <li>• <strong>Errors</strong> - Comprehensive error reporting</li>
            </ul>
          </div>

          {!announcement.id && (
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>⚠️ Important:</strong> Save this announcement first to get the actual widget script with the correct ID.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
