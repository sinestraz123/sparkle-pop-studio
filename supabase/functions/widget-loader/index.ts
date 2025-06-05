
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const announcementId = url.searchParams.get('id');

    if (!announcementId) {
      return new Response('Missing announcement ID', { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'text/javascript' } 
      });
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch announcement data
    const { data: announcement, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', announcementId)
      .eq('status', 'active')
      .single();

    if (error || !announcement) {
      return new Response('// Announcement not found or not active', { 
        headers: { ...corsHeaders, 'Content-Type': 'text/javascript' } 
      });
    }

    // Increment view count
    await supabase
      .from('announcements')
      .update({ views: (announcement.views || 0) + 1 })
      .eq('id', announcementId);

    // Generate the enhanced widget JavaScript with smart triggers
    const widgetScript = `
(function() {
  if (window.AnnouncementWidget_${announcementId}) return;
  window.AnnouncementWidget_${announcementId} = true;

  const data = ${JSON.stringify(announcement)};
  const API_BASE_URL = 'https://qpelvplxusbfyacgipgp.supabase.co/functions/v1';
  let widgetShown = false;
  let pageStartTime = Date.now();
  let maxScroll = 0;

  function trackClick() {
    fetch(API_BASE_URL + '/widget-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ announcementId: '${announcementId}' })
    }).catch(e => console.log('Track failed:', e));
  }

  function handleButtonClick() {
    trackClick();
    const buttonAction = data.button_action || 'url';
    
    if (buttonAction === 'close') {
      // Just close the announcement
      const overlay = document.getElementById('aw-${announcementId}');
      if (overlay) {
        overlay.remove();
        widgetShown = false;
      }
    } else if (buttonAction === 'url' && data.button_url) {
      // Navigate to URL and close
      window.open(data.button_url, '_blank');
      const overlay = document.getElementById('aw-${announcementId}');
      if (overlay) {
        overlay.remove();
        widgetShown = false;
      }
    }
  }

  // Smart trigger functions
  function trackScrollPercentage() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);
    maxScroll = Math.max(maxScroll, scrollPercent);
    return scrollPercent;
  }

  function trackTimeOnPage() {
    return Math.round((Date.now() - pageStartTime) / 1000);
  }

  function setupExitIntent() {
    let exitIntentShown = false;
    document.addEventListener('mouseleave', function(e) {
      if (e.clientY <= 0 && !exitIntentShown && !widgetShown) {
        exitIntentShown = true;
        createAnnouncement();
      }
    });
  }

  function createAnnouncement() {
    if (widgetShown) return;
    widgetShown = true;

    const overlay = document.createElement('div');
    overlay.id = 'aw-${announcementId}';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;';

    const container = document.createElement('div');
    container.style.cssText = \`background:\${data.background_color||'#fff'};color:\${data.text_color||'#000'};border-radius:8px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);max-width:400px;width:90%;position:relative;overflow:hidden;animation:slideIn 0.3s ease-out;\`;

    if (!document.getElementById('aw-styles')) {
      const styles = document.createElement('style');
      styles.id = 'aw-styles';
      styles.textContent = '@keyframes slideIn{from{opacity:0;transform:scale(0.9) translateY(-20px)}to{opacity:1;transform:scale(1) translateY(0)}}';
      document.head.appendChild(styles);
    }

    let closeBtn = '';
    if (data.show_close_button !== false) {
      closeBtn = \`<button onclick="document.getElementById('aw-${announcementId}').remove();widgetShown=false;" style="position:absolute;top:12px;right:12px;background:none;border:none;font-size:20px;cursor:pointer;color:\${data.text_color||'#000'};width:24px;height:24px;">×</button>\`;
    }

    let media = '';
    if (data.video_url) {
      const videoId = data.video_url.match(/(?:youtube\\.com\\/watch\\?v=|youtu\\.be\\/)([^&\\n?#]+)/);
      if (videoId) {
        media = \`<div style="aspect-ratio:16/9;background:#000;"><iframe src="https://www.youtube.com/embed/\${videoId[1]}" style="width:100%;height:100%;border:none;" allowfullscreen></iframe></div>\`;
      }
    } else if (data.image_url) {
      media = \`<div style="aspect-ratio:16/9;background:linear-gradient(135deg,#10b981,#3b82f6,#ef4444);display:flex;align-items:center;justify-content:center;"><img src="\${data.image_url}" style="max-width:100%;max-height:100%;object-fit:contain;"/></div>\`;
    }

    let button = '';
    if (data.button_text) {
      const buttonAction = data.button_action || 'url';
      button = \`<button onclick="handleButtonClick();" style="width:100%;padding:12px 24px;background:\${data.button_color||'#000'};color:white;border:none;border-radius:6px;font-weight:600;cursor:pointer;margin-top:16px;">\${data.button_text}</button>\`;
    }

    container.innerHTML = \`\${closeBtn}\${media}<div style="padding:24px;"><h2 style="font-size:20px;font-weight:bold;margin:0 0 12px 0;line-height:1.3;">\${data.title}</h2><p style="font-size:14px;line-height:1.5;margin:0 0 16px 0;opacity:0.8;">\${data.description}</p>\${button}</div>\`;

    overlay.appendChild(container);
    document.body.appendChild(overlay);

    // Make handleButtonClick available globally for the button
    window.handleButtonClick = handleButtonClick;

    overlay.onclick = (e) => { if (e.target === overlay) { overlay.remove(); widgetShown = false; } };
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        overlay.remove();
        widgetShown = false;
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  // Initialize smart triggers based on trigger_type
  const triggerType = data.trigger_type || 'auto_show';
  
  switch (triggerType) {
    case 'auto_show':
      if (data.auto_show !== false) {
        setTimeout(createAnnouncement, data.delay || 2000);
      }
      break;
      
    case 'time_on_page':
      const targetTime = (data.delay || 30000) / 1000; // Convert to seconds
      setInterval(() => {
        if (!widgetShown && trackTimeOnPage() >= targetTime) {
          createAnnouncement();
        }
      }, 1000);
      break;
      
    case 'scroll_percent':
      const targetScroll = data.delay || 50; // Percentage
      window.addEventListener('scroll', () => {
        if (!widgetShown && trackScrollPercentage() >= targetScroll) {
          createAnnouncement();
        }
      });
      break;
      
    case 'exit_intent':
      setupExitIntent();
      break;
  }

  // Expose manual trigger function for non-auto triggers
  if (triggerType !== 'auto_show') {
    window.showAnnouncement = createAnnouncement;
  }

  // Expose refresh function
  window.refreshAnnouncement = () => {
    widgetShown = false;
    const script = document.createElement('script');
    script.src = 'https://qpelvplxusbfyacgipgp.supabase.co/functions/v1/widget-loader?id=${announcementId}&t=' + Date.now();
    document.head.appendChild(script);
  };
})();`;

    return new Response(widgetScript, { 
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/javascript',
        'Cache-Control': 'public, max-age=300' // 5 minutes cache
      } 
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response('// Widget loading failed', { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'text/javascript' } 
    });
  }
});
