
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const announcementId = url.searchParams.get('id');
    const isTest = url.searchParams.get('test') === '1';

    console.log('Widget loader called:', { announcementId, isTest });

    if (!announcementId) {
      return new Response('console.error("Widget: Missing announcement ID");', { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'text/javascript' } 
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: announcement, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', announcementId)
      .single();

    if (error || !announcement) {
      console.log('Announcement not found:', error);
      return new Response('console.warn("Widget: Announcement not found");', { 
        headers: { ...corsHeaders, 'Content-Type': 'text/javascript' } 
      });
    }

    // Only check status for non-test requests
    if (!isTest && announcement.status !== 'active') {
      return new Response('console.warn("Widget: Announcement not active");', { 
        headers: { ...corsHeaders, 'Content-Type': 'text/javascript' } 
      });
    }

    console.log('Loading announcement:', announcement.title);

    // Update view count
    if (!isTest) {
      supabase
        .from('announcements')
        .update({ views: (announcement.views || 0) + 1 })
        .eq('id', announcementId)
        .then(() => console.log('View count updated'))
        .catch((err) => console.log('Failed to update view count:', err));
    }

    const data = {
      title: sanitizeHtml(announcement.title || ''),
      description: sanitizeHtml(announcement.description || ''),
      button_text: sanitizeHtml(announcement.button_text || ''),
      button_url: announcement.button_url && isValidUrl(announcement.button_url) ? announcement.button_url : '',
      button_action: announcement.button_action || 'url',
      image_url: announcement.image_url && isValidUrl(announcement.image_url) ? announcement.image_url : '',
      video_url: announcement.video_url || '',
      background_color: announcement.background_color || '#ffffff',
      text_color: announcement.text_color || '#000000',
      button_color: announcement.button_color || '#000000',
      show_close_button: announcement.show_close_button !== false,
      trigger_type: announcement.trigger_type || 'auto_show',
      delay: Math.max(0, Math.min(60000, announcement.delay || 2000))
    };

    const widgetScript = `
(function() {
  console.log('${isTest ? '[TEST] ' : ''}Widget loading:', '${data.title}');
  
  const widgetId = '${announcementId}';
  const isTestMode = ${isTest};
  
  if (window['aw_' + widgetId] && !isTestMode) {
    console.log('Widget already loaded');
    return;
  }
  window['aw_' + widgetId] = true;

  let widgetShown = false;

  function trackClick() {
    console.log('Widget: Button clicked');
    fetch('https://qpelvplxusbfyacgipgp.supabase.co/functions/v1/widget-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ announcementId: widgetId })
    }).catch(console.warn);
  }

  function closeWidget() {
    const overlay = document.getElementById('aw-' + widgetId);
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        widgetShown = false;
      }, 200);
    }
  }

  function ensureBodyExists(callback) {
    if (document.body) {
      callback();
    } else {
      // If body doesn't exist yet, wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
      } else {
        // Fallback: check every 10ms for body to exist
        const checkForBody = setInterval(() => {
          if (document.body) {
            clearInterval(checkForBody);
            callback();
          }
        }, 10);
        
        // Safety timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkForBody);
          if (document.body) callback();
        }, 5000);
      }
    }
  }

  function createWidget() {
    if (widgetShown) return;
    widgetShown = true;
    
    console.log('${isTest ? '[TEST] ' : ''}Creating widget');

    ensureBodyExists(() => {
      const overlay = document.createElement('div');
      overlay.id = 'aw-' + widgetId;
      overlay.style.cssText = \`
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: rgba(0,0,0,0.5) !important;
        z-index: 999999 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        opacity: 0 !important;
        transition: opacity 0.2s ease !important;
        pointer-events: auto !important;
      \`;

      const container = document.createElement('div');
      container.style.cssText = \`
        background: ${data.background_color} !important;
        color: ${data.text_color} !important;
        border-radius: 12px !important;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important;
        max-width: min(400px, 90vw) !important;
        width: 100% !important;
        position: relative !important;
        overflow: hidden !important;
        transform: scale(0.9) !important;
        transition: transform 0.2s ease !important;
        pointer-events: auto !important;
      \`;

      let closeBtn = '';
      if (${data.show_close_button}) {
        closeBtn = \`
          <button onclick="window.awClose\${widgetId}()" 
                  style="position: absolute !important; top: 12px !important; right: 12px !important; 
                         background: none !important; border: none !important; font-size: 24px !important; 
                         cursor: pointer !important; color: ${data.text_color} !important; 
                         width: 32px !important; height: 32px !important; pointer-events: auto !important;">×</button>
        \`;
      }

      let media = '';
      if (${JSON.stringify(data.video_url)}) {
        const videoId = '${data.video_url}'.match(/(?:youtube\\.com\\/watch\\?v=|youtu\\.be\\/)([^&\\n?#]+)/);
        if (videoId) {
          media = \`
            <div style="aspect-ratio: 16/9 !important; background: #000 !important;">
              <iframe src="https://www.youtube.com/embed/\${videoId[1]}?rel=0" 
                      style="width: 100% !important; height: 100% !important; border: none !important; pointer-events: auto !important;" 
                      allowfullscreen></iframe>
            </div>
          \`;
        }
      } else if (${JSON.stringify(data.image_url)}) {
        media = \`
          <div style="aspect-ratio: 16/9 !important; display: flex !important; align-items: center !important; justify-content: center !important; background: #f0f0f0 !important;">
            <img src="${data.image_url}" 
                 style="max-width: 100% !important; max-height: 100% !important; object-fit: contain !important;" 
                 alt="Announcement" />
          </div>
        \`;
      }

      let button = '';
      if (${JSON.stringify(data.button_text)}) {
        button = \`
          <button onclick="window.awButton\${widgetId}()" 
                  style="width: 100% !important; padding: 14px 24px !important; 
                         background: ${data.button_color} !important; color: white !important; 
                         border: none !important; border-radius: 8px !important; 
                         font-weight: 600 !important; cursor: pointer !important; 
                         margin-top: 16px !important; font-size: 16px !important;
                         pointer-events: auto !important;">
            ${data.button_text}
          </button>
        \`;
      }

      container.innerHTML = \`
        \${closeBtn}
        \${media}
        <div style="padding: 24px !important; pointer-events: auto !important;">
          <h2 style="font-size: 20px !important; font-weight: bold !important; 
                     margin: 0 0 8px 0 !important; line-height: 1.3 !important;">${data.title}</h2>
          <p style="font-size: 14px !important; line-height: 1.4 !important; 
                    margin: 0 !important; opacity: 0.9 !important;">${data.description}</p>
          \${button}
        </div>
      \`;

      overlay.appendChild(container);

      window['awClose' + widgetId] = closeWidget;
      window['awButton' + widgetId] = function() {
        trackClick();
        if ('${data.button_action}' === 'close') {
          closeWidget();
        } else if ('${data.button_action}' === 'url' && '${data.button_url}') {
          window.open('${data.button_url}', '_blank');
          closeWidget();
        }
      };

      overlay.onclick = function(e) {
        if (e.target === overlay) closeWidget();
      };

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeWidget();
      });

      document.body.appendChild(overlay);
      
      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        container.style.transform = 'scale(1)';
      });

      console.log('${isTest ? '[TEST] ' : ''}Widget created and displayed');
    });
  }

  function initializeWidget() {
    // Trigger logic
    const triggerType = '${data.trigger_type}';
    const delay = ${data.delay};

    if (isTestMode) {
      console.log('[TEST] Creating widget immediately for testing');
      setTimeout(createWidget, 500);
    } else {
      switch (triggerType) {
        case 'auto_show':
          setTimeout(createWidget, delay);
          break;
        case 'time_on_page':
          setTimeout(createWidget, delay);
          break;
        case 'scroll_percent':
          const handleScroll = () => {
            const scrollPercent = Math.round((window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent >= (delay || 50)) {
              createWidget();
              window.removeEventListener('scroll', handleScroll);
            }
          };
          window.addEventListener('scroll', handleScroll);
          break;
        case 'exit_intent':
          document.addEventListener('mouseleave', function(e) {
            if (e.clientY <= 0) createWidget();
          });
          break;
        default:
          setTimeout(createWidget, delay);
      }
    }

    // Expose manual trigger
    window.showAnnouncement = createWidget;
  }

  // Initialize the widget when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWidget);
  } else {
    initializeWidget();
  }
})();`;

    return new Response(widgetScript, { 
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/javascript',
        'Cache-Control': 'no-cache'
      } 
    });

  } catch (error) {
    console.error('Widget loader error:', error);
    return new Response(`console.error("Widget loading failed: ${error.message}");`, { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'text/javascript' } 
    });
  }
});
