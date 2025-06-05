
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check, Shield, Zap, Globe, AlertTriangle } from 'lucide-react';
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
  js.onerror=function(){console.error('Likemetric widget failed to load')};
  d.head.appendChild(js);
})(window,document,'script','${announcementId}');
</script>`;
  };

  const generateTestScript = () => {
    const announcementId = announcement.id || 'YOUR_ANNOUNCEMENT_ID';
    
    return `<!-- Debug Version - Use this for testing -->
<script>
console.log('Loading Likemetric widget with ID: ${announcementId}');
(function(w,d,s,id){
  if(w['aw_'+id]) {
    console.log('Widget already loaded');
    return;
  }
  w['aw_'+id]=1;
  var js=d.createElement(s);
  js.async=1;
  js.crossOrigin='anonymous';
  js.src='https://qpelvplxusbfyacgipgp.supabase.co/functions/v1/widget-loader?id='+id;
  js.onload=function(){console.log('Widget script loaded successfully')};
  js.onerror=function(){console.error('Widget script failed to load')};
  d.head.appendChild(js);
  console.log('Widget script added to page');
})(window,document,'script','${announcementId}');

// Manual trigger for testing
setTimeout(function() {
  if (window.showAnnouncement) {
    console.log('Manual trigger available - call showAnnouncement() in console');
  } else {
    console.warn('Manual trigger not available - check for errors above');
  }
}, 3000);
</script>`;
  };

  const handleCopy = async (scriptType = 'production') => {
    try {
      const script = scriptType === 'debug' ? generateTestScript() : generateScript();
      await navigator.clipboard.writeText(script);
      setCopied(true);
      toast({
        title: "Copied!",
        description: `${scriptType === 'debug' ? 'Debug' : 'Production'} script copied to clipboard`,
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
          {!announcement.id && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm text-red-800 font-medium mb-2">
                    ⚠️ Important: Save this announcement first!
                  </p>
                  <p className="text-xs text-red-700">
                    You need to save this announcement to get the actual widget script with the correct ID.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Troubleshooting Section */}
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h4 className="font-medium text-amber-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              🔧 Widget Not Showing? Try These Steps:
            </h4>
            <div className="space-y-2 text-sm text-amber-800">
              <p><strong>1. Use the Debug Version:</strong> Copy the debug script below to see detailed console logs</p>
              <p><strong>2. Check Browser Console:</strong> Open DevTools (F12) → Console tab for error messages</p>
              <p><strong>3. Manual Test:</strong> After 3 seconds, type <code className="bg-amber-100 px-1 rounded">showAnnouncement()</code> in console</p>
              <p><strong>4. Check Announcement Status:</strong> Ensure your announcement is set to "Active" status</p>
              <p><strong>5. Domain Issues:</strong> Try on a different domain or localhost first</p>
            </div>
          </div>

          {/* Debug Script */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">🐛 Debug Version (Use for Testing)</h4>
              <Button
                onClick={() => handleCopy('debug')}
                size="sm"
                variant="outline"
                className="bg-amber-50 border-amber-200 hover:bg-amber-100"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copy Debug Script
              </Button>
            </div>
            <Textarea
              value={generateTestScript()}
              readOnly
              className="font-mono text-xs min-h-[120px] resize-none bg-amber-50 border-amber-200"
            />
          </div>

          {/* Production Script */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">🚀 Production Version</h4>
              <Button
                onClick={() => handleCopy('production')}
                size="sm"
                variant="outline"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copy Production Script
              </Button>
            </div>
            <Textarea
              value={generateScript()}
              readOnly
              className="font-mono text-xs min-h-[100px] resize-none bg-gray-50"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">
              📍 Installation Instructions
            </p>
            <ol className="text-xs text-blue-700 space-y-1 ml-4">
              <li>1. Copy the script above</li>
              <li>2. Paste it before the closing &lt;/body&gt; tag on your website</li>
              <li>3. Save and reload your page</li>
              <li>4. Check browser console for any errors</li>
            </ol>
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

          {/* Manual Control */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">🎛️ Testing & Manual Control</h4>
            <div className="grid md:grid-cols-2 gap-4 text-xs text-gray-700">
              <div>
                <strong>Trigger manually:</strong>
                <code className="block bg-gray-100 p-1 rounded mt-1">showAnnouncement()</code>
              </div>
              <div>
                <strong>Refresh with latest data:</strong>
                <code className="block bg-gray-100 p-1 rounded mt-1">refreshAnnouncement()</code>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Open browser console and run these commands to test the widget manually.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
