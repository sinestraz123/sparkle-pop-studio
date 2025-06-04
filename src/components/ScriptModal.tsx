
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
    
    return `<!-- Dynamic Announcement Widget Script -->
<script>
(function() {
  const ANNOUNCEMENT_ID = '${announcementId}';
  const API_BASE_URL = 'https://qpelvplxusbfyacgipgp.supabase.co/functions/v1';

  let announcementData = null;
  let widgetShown = false;

  // Fetch announcement data from API
  async function fetchAnnouncementData() {
    try {
      const response = await fetch(\`\${API_BASE_URL}/widget-data?id=\${ANNOUNCEMENT_ID}\`);
      if (!response.ok) {
        console.log('Announcement not found or not active');
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch announcement:', error);
      return null;
    }
  }

  // Track button clicks
  async function trackClick() {
    try {
      await fetch(\`\${API_BASE_URL}/widget-click\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ announcementId: ANNOUNCEMENT_ID })
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  }

  // Create and show announcement
  function createAnnouncement(data) {
    if (widgetShown) return; // Prevent multiple instances
    widgetShown = true;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'announcement-overlay-' + ANNOUNCEMENT_ID;
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
      background: \${data.background_color || '#ffffff'};
      color: \${data.text_color || '#000000'};
      border-radius: 8px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      width: 90%;
      position: relative;
      overflow: hidden;
      animation: slideIn 0.3s ease-out;
    \`;

    // Add CSS animation
    if (!document.getElementById('announcement-styles')) {
      const styles = document.createElement('style');
      styles.id = 'announcement-styles';
      styles.textContent = \`
        @keyframes slideIn {
          from { opacity: 0; transform: scale(0.9) translateY(-20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      \`;
      document.head.appendChild(styles);
    }

    // Add close button if enabled
    let closeButton = '';
    if (data.show_close_button !== false) {
      closeButton = \`
        <button onclick="document.getElementById('announcement-overlay-\${ANNOUNCEMENT_ID}').remove(); widgetShown = false;" 
                style="position: absolute; top: 12px; right: 12px; background: none; border: none; font-size: 20px; cursor: pointer; color: \${data.text_color || '#000000'}; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; hover:background: rgba(0,0,0,0.1);">
          ×
        </button>
      \`;
    }

    // Add media if provided
    let mediaHtml = '';
    if (data.video_url) {
      // Extract video ID for YouTube
      const videoId = data.video_url.match(/(?:youtube\\.com\\/watch\\?v=|youtu\\.be\\/)([^&\\n?#]+)/);
      if (videoId) {
        mediaHtml = \`
          <div style="aspect-ratio: 16/9; background: #000;">
            <iframe 
              src="https://www.youtube.com/embed/\${videoId[1]}" 
              style="width: 100%; height: 100%; border: none;"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen>
            </iframe>
          </div>
        \`;
      }
    } else if (data.image_url) {
      mediaHtml = \`
        <div style="aspect-ratio: 16/9; background: linear-gradient(135deg, #10b981, #3b82f6, #ef4444); display: flex; align-items: center; justify-content: center;">
          <img src="\${data.image_url}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
        </div>
      \`;
    }

    // Add button if provided
    let buttonHtml = '';
    if (data.button_text) {
      buttonHtml = \`
        <button onclick="trackClick(); if('\${data.button_url}') window.open('\${data.button_url}', '_blank');" 
                style="width: 100%; padding: 12px 24px; background: \${data.button_color || '#000000'}; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; margin-top: 16px; transition: opacity 0.2s;">
          \${data.button_text}
        </button>
      \`;
    }

    container.innerHTML = \`
      \${closeButton}
      \${mediaHtml}
      <div style="padding: 24px;">
        <h2 style="font-size: 20px; font-weight: bold; margin: 0 0 12px 0; line-height: 1.3;">\${data.title}</h2>
        <p style="font-size: 14px; line-height: 1.5; margin: 0 0 16px 0; opacity: 0.8;">\${data.description}</p>
        \${buttonHtml}
      </div>
    \`;

    overlay.appendChild(container);
    document.body.appendChild(overlay);

    // Close on overlay click
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        overlay.remove();
        widgetShown = false;
      }
    });

    // Close on escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        overlay.remove();
        widgetShown = false;
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  // Initialize widget
  async function initWidget() {
    const data = await fetchAnnouncementData();
    if (!data) return;

    announcementData = data;

    // Show announcement based on configuration
    if (data.auto_show !== false) {
      setTimeout(() => createAnnouncement(data), data.delay || 2000);
    } else {
      // Expose function globally for manual triggering
      window.showAnnouncement = () => createAnnouncement(data);
    }
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }

  // Expose refresh function to reload announcement data
  window.refreshAnnouncement = async () => {
    widgetShown = false;
    await initWidget();
  };
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
          <DialogTitle>Dynamic Widget Script</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            This dynamic script will automatically fetch the latest announcement data from our servers. 
            Paste it into your website's HTML, preferably before the closing &lt;/body&gt; tag.
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
            <h4 className="font-medium text-blue-900 mb-1">Key Features:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Automatically fetches live data from your announcement settings</li>
              <li>• Tracks views and clicks for analytics</li>
              <li>• Updates instantly when you modify the announcement</li>
              <li>• Call <code className="bg-blue-100 px-1 rounded">showAnnouncement()</code> for manual triggering</li>
              <li>• Call <code className="bg-blue-100 px-1 rounded">refreshAnnouncement()</code> to reload data</li>
            </ul>
          </div>

          {!announcement.id && (
            <div className="bg-amber-50 p-3 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Please save this announcement first to get the actual widget script with the correct ID.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
