
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
    const config = {
      id: 'announcement-' + Date.now(),
      title: announcement.title,
      description: announcement.description,
      type: announcement.type,
      position: announcement.position,
      backgroundColor: announcement.background_color,
      textColor: announcement.text_color,
      buttonColor: announcement.button_color,
      buttonText: announcement.button_text,
      buttonUrl: announcement.button_url,
      imageUrl: announcement.image_url,
      showCloseButton: announcement.show_close_button,
      autoShow: announcement.auto_show,
      delay: announcement.delay
    };

    return `<!-- Announcement Widget Script -->
<script>
(function() {
  const config = ${JSON.stringify(config, null, 2)};
  
  function createAnnouncement() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'announcement-overlay';
    overlay.style.cssText = \`
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
    \`;

    // Create announcement container
    const container = document.createElement('div');
    container.style.cssText = \`
      background: \${config.backgroundColor};
      color: \${config.textColor};
      border-radius: 8px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      width: 90%;
      position: relative;
      overflow: hidden;
    \`;

    // Add close button if enabled
    let closeButton = '';
    if (config.showCloseButton) {
      closeButton = \`
        <button onclick="document.getElementById('announcement-overlay').remove()" 
                style="position: absolute; top: 12px; right: 12px; background: none; border: none; font-size: 20px; cursor: pointer; color: \${config.textColor};">
          ×
        </button>
      \`;
    }

    // Add image if provided
    let imageHtml = '';
    if (config.imageUrl) {
      imageHtml = \`<div style="aspect-ratio: 16/9; background: linear-gradient(135deg, #10b981, #3b82f6, #ef4444); display: flex; align-items: center; justify-content: center;"><img src="\${config.imageUrl}" style="max-width: 100%; max-height: 100%; object-fit: contain;" /></div>\`;
    }

    // Add button if provided
    let buttonHtml = '';
    if (config.buttonText) {
      buttonHtml = \`
        <button onclick="window.open('\${config.buttonUrl}', '_blank')" 
                style="width: 100%; padding: 12px 24px; background: \${config.buttonColor}; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; margin-top: 16px;">
          \${config.buttonText}
        </button>
      \`;
    }

    container.innerHTML = \`
      \${closeButton}
      \${imageHtml}
      <div style="padding: 24px;">
        <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 12px; margin: 0 0 12px 0;">\${config.title}</h2>
        <p style="font-size: 14px; line-height: 1.5; margin: 0 0 16px 0;">\${config.description}</p>
        \${buttonHtml}
      </div>
    \`;

    overlay.appendChild(container);
    document.body.appendChild(overlay);

    // Close on overlay click
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        overlay.remove();
      }
    });
  }

  // Show announcement based on configuration
  if (config.autoShow) {
    setTimeout(createAnnouncement, config.delay || 0);
  } else {
    // Expose function globally for manual triggering
    window.showAnnouncement = createAnnouncement;
  }
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Embed Script</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Copy and paste this script into your website's HTML, preferably before the closing &lt;/body&gt; tag.
          </p>
          
          <div className="relative">
            <Textarea
              value={generateScript()}
              readOnly
              className="font-mono text-xs min-h-[400px] resize-none"
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

          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-1">Usage:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• The script will automatically show the announcement based on your trigger settings</li>
              <li>• For manual triggering, call <code className="bg-blue-100 px-1 rounded">showAnnouncement()</code> in your JavaScript</li>
              <li>• The script is lightweight and doesn't require any external dependencies</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
