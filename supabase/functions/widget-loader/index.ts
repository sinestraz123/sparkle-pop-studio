
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

// Security: HTML sanitization function
function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Security: URL validation
function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const announcementId = url.searchParams.get('id');

    console.log('Widget loader called with ID:', announcementId);

    if (!announcementId) {
      console.log('Missing announcement ID');
      return new Response('console.error("Likemetric Widget: Missing announcement ID");', { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'text/javascript' } 
      });
    }

    // Security: Validate announcement ID format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(announcementId)) {
      console.log('Invalid announcement ID format:', announcementId);
      return new Response('console.error("Likemetric Widget: Invalid announcement ID format");', { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'text/javascript' } 
      });
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch announcement data with error handling
    const { data: announcement, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', announcementId)
      .eq('status', 'active')
      .single();

    if (error || !announcement) {
      console.log('Announcement not found or not active:', error);
      return new Response('console.warn("Likemetric Widget: Announcement not found or not active");', { 
        headers: { ...corsHeaders, 'Content-Type': 'text/javascript' } 
      });
    }

    console.log('Found announcement:', announcement.title);

    // Increment view count in background (don't await to avoid blocking)
    supabase
      .from('announcements')
      .update({ views: (announcement.views || 0) + 1 })
      .eq('id', announcementId)
      .then(() => {
        console.log('View count updated');
      }).catch((err) => {
        console.log('Failed to update view count:', err);
      });

    // Generate the production-ready widget JavaScript with enhanced debugging
    const widgetScript = `
(function() {
  'use strict';
  
  console.log('Likemetric Widget: Loading...');
  
  // Security: Prevent multiple instances
  const widgetKey = 'aw_${announcementId}';
  if (window[widgetKey]) {
    console.log('Likemetric Widget: Already loaded, skipping');
    return;
  }
  window[widgetKey] = true;

  // Configuration with fallbacks
  const CONFIG = {
    API_BASE_URL: '${Deno.env.get('SUPABASE_URL')}/functions/v1' || 'https://qpelvplxusbfyacgipgp.supabase.co/functions/v1',
    WIDGET_ID: '${announcementId}',
    MAX_RETRIES: 3,
    THROTTLE_MS: 100,
    ANIMATION_DURATION: 300
  };

  console.log('Likemetric Widget: Config loaded', CONFIG);

  // Sanitized announcement data
  const data = {
    title: ${JSON.stringify(sanitizeHtml(announcement.title || ''))},
    description: ${JSON.stringify(sanitizeHtml(announcement.description || ''))},
    button_text: ${JSON.stringify(sanitizeHtml(announcement.button_text || ''))},
    button_url: ${JSON.stringify(announcement.button_url && isValidUrl(announcement.button_url) ? announcement.button_url : '')},
    button_action: ${JSON.stringify(announcement.button_action || 'url')},
    image_url: ${JSON.stringify(announcement.image_url && isValidUrl(announcement.image_url) ? announcement.image_url : '')},
    video_url: ${JSON.stringify(announcement.video_url || '')},
    background_color: ${JSON.stringify(announcement.background_color || '#ffffff')},
    text_color: ${JSON.stringify(announcement.text_color || '#000000')},
    button_color: ${JSON.stringify(announcement.button_color || '#000000')},
    show_close_button: ${announcement.show_close_button !== false},
    trigger_type: ${JSON.stringify(announcement.trigger_type || 'auto_show')},
    delay: ${Math.max(0, Math.min(60000, announcement.delay || 2000))} // Clamp between 0-60s
  };

  console.log('Likemetric Widget: Data loaded', data);

  // State management
  let widgetShown = false;
  let pageStartTime = Date.now();
  let maxScroll = 0;
  let cleanupFunctions = [];
  let retryCount = 0;

  // Performance: Throttling utility
  function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
      const currentTime = Date.now();
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }

  // Error handling utility
  function handleError(error, context) {
    console.warn('Likemetric Widget Error:', context, error);
  }

  // Analytics with retry logic
  function trackClick() {
    if (retryCount >= CONFIG.MAX_RETRIES) return;
    
    console.log('Likemetric Widget: Tracking click');
    
    fetch(CONFIG.API_BASE_URL + '/widget-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ announcementId: CONFIG.WIDGET_ID })
    }).then(response => {
      console.log('Likemetric Widget: Click tracked successfully');
    }).catch(error => {
      retryCount++;
      handleError(error, 'click tracking');
      if (retryCount < CONFIG.MAX_RETRIES) {
        setTimeout(() => trackClick(), 1000 * retryCount);
      }
    });
  }

  // Enhanced button click handler
  function handleButtonClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('Likemetric Widget: Button clicked');
    
    try {
      trackClick();
      
      if (data.button_action === 'close') {
        closeWidget();
      } else if (data.button_action === 'url' && data.button_url) {
        window.open(data.button_url, '_blank', 'noopener,noreferrer');
        closeWidget();
      }
    } catch (error) {
      handleError(error, 'button click');
    }
  }

  // Enhanced close function
  function closeWidget() {
    console.log('Likemetric Widget: Closing widget');
    const overlay = document.getElementById('aw-' + CONFIG.WIDGET_ID);
    if (overlay) {
      overlay.style.opacity = '0';
      overlay.style.transform = 'scale(0.9)';
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        widgetShown = false;
        cleanup();
      }, CONFIG.ANIMATION_DURATION);
    }
  }

  // Cleanup function
  function cleanup() {
    cleanupFunctions.forEach(fn => {
      try { fn(); } catch (e) { handleError(e, 'cleanup'); }
    });
    cleanupFunctions = [];
  }

  // Smart trigger functions with throttling
  const trackScrollPercentage = throttle(() => {
    try {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
      maxScroll = Math.max(maxScroll, Math.min(100, scrollPercent));
      return scrollPercent;
    } catch (error) {
      handleError(error, 'scroll tracking');
      return 0;
    }
  }, CONFIG.THROTTLE_MS);

  function trackTimeOnPage() {
    return Math.round((Date.now() - pageStartTime) / 1000);
  }

  function setupExitIntent() {
    let exitIntentShown = false;
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !exitIntentShown && !widgetShown) {
        exitIntentShown = true;
        createAnnouncement();
      }
    };
    
    document.addEventListener('mouseleave', handleMouseLeave);
    cleanupFunctions.push(() => document.removeEventListener('mouseleave', handleMouseLeave));
  }

  // Enhanced announcement creation with accessibility
  function createAnnouncement() {
    if (widgetShown) {
      console.log('Likemetric Widget: Widget already shown, skipping');
      return;
    }
    
    console.log('Likemetric Widget: Creating announcement');
    
    try {
      widgetShown = true;

      // Create overlay with enhanced styling
      const overlay = document.createElement('div');
      overlay.id = 'aw-' + CONFIG.WIDGET_ID;
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', data.title);
      overlay.style.cssText = \`
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: rgba(0,0,0,0.5) !important;
        z-index: 2147483647 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        opacity: 0 !important;
        transition: opacity \${CONFIG.ANIMATION_DURATION}ms ease-out !important;
        backdrop-filter: blur(2px) !important;
      \`;

      // Create container with responsive design
      const container = document.createElement('div');
      container.style.cssText = \`
        background: \${data.background_color} !important;
        color: \${data.text_color} !important;
        border-radius: 12px !important;
        box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25) !important;
        max-width: min(400px, 90vw) !important;
        width: 100% !important;
        max-height: 90vh !important;
        position: relative !important;
        overflow: hidden !important;
        transform: scale(0.9) !important;
        transition: transform \${CONFIG.ANIMATION_DURATION}ms ease-out !important;
      \`;

      // Inject enhanced styles
      if (!document.getElementById('aw-styles')) {
        const styles = document.createElement('style');
        styles.id = 'aw-styles';
        styles.textContent = \`
          @keyframes awSlideIn { 
            from { opacity: 0; transform: scale(0.9) translateY(-20px); } 
            to { opacity: 1; transform: scale(1) translateY(0); } 
          }
          .aw-focus-trap:focus { outline: 2px solid #0066cc; outline-offset: 2px; }
          @media (max-width: 768px) {
            .aw-container { margin: 16px !important; }
          }
        \`;
        document.head.appendChild(styles);
      }

      // Close button with accessibility
      let closeBtn = '';
      if (data.show_close_button) {
        closeBtn = \`
          <button 
            onclick="window.awClose\${CONFIG.WIDGET_ID}()" 
            style="position: absolute !important; top: 12px !important; right: 12px !important; 
                   background: none !important; border: none !important; font-size: 24px !important; 
                   cursor: pointer !important; color: \${data.text_color} !important; 
                   width: 32px !important; height: 32px !important; display: flex !important;
                   align-items: center !important; justify-content: center !important;
                   border-radius: 4px !important; transition: background-color 0.2s !important;"
            aria-label="Close announcement"
            class="aw-focus-trap"
            onmouseover="this.style.backgroundColor='rgba(0,0,0,0.1)'"
            onmouseout="this.style.backgroundColor='transparent'"
          >×</button>
        \`;
      }

      // Enhanced media rendering
      let media = '';
      if (data.video_url) {
        const videoId = data.video_url.match(/(?:youtube\\.com\\/watch\\?v=|youtu\\.be\\/)([^&\\n?#]+)/);
        if (videoId) {
          media = \`
            <div style="aspect-ratio: 16/9 !important; background: #000 !important;">
              <iframe 
                src="https://www.youtube.com/embed/\${videoId[1]}?rel=0" 
                style="width: 100% !important; height: 100% !important; border: none !important;" 
                allowfullscreen 
                loading="lazy"
                title="Video content">
              </iframe>
            </div>
          \`;
        }
      } else if (data.image_url) {
        media = \`
          <div style="aspect-ratio: 16/9 !important; background: linear-gradient(135deg,#10b981,#3b82f6,#ef4444) !important; 
                      display: flex !important; align-items: center !important; justify-content: center !important;">
            <img 
              src="\${data.image_url}" 
              alt="Announcement image"
              style="max-width: 100% !important; max-height: 100% !important; object-fit: contain !important;"
              loading="lazy"
              onerror="this.style.display='none'"
            />
          </div>
        \`;
      }

      // Enhanced button
      let button = '';
      if (data.button_text) {
        button = \`
          <button 
            onclick="window.awButtonClick\${CONFIG.WIDGET_ID}(event)" 
            style="width: 100% !important; padding: 14px 24px !important; 
                   background: \${data.button_color} !important; color: white !important; 
                   border: none !important; border-radius: 8px !important; 
                   font-weight: 600 !important; cursor: pointer !important; 
                   margin-top: 20px !important; font-size: 16px !important;
                   transition: transform 0.2s, box-shadow 0.2s !important;"
            class="aw-focus-trap"
            onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
          >\${data.button_text}</button>
        \`;
      }

      // Assemble the widget
      container.innerHTML = \`
        \${closeBtn}
        \${media}
        <div style="padding: 24px !important;">
          <h2 style="font-size: 22px !important; font-weight: bold !important; 
                     margin: 0 0 12px 0 !important; line-height: 1.3 !important;">\${data.title}</h2>
          <p style="font-size: 15px !important; line-height: 1.5 !important; 
                    margin: 0 0 16px 0 !important; opacity: 0.9 !important;">\${data.description}</p>
          \${button}
        </div>
      \`;

      overlay.appendChild(container);

      // Enhanced event handlers
      window['awClose' + CONFIG.WIDGET_ID] = closeWidget;
      window['awButtonClick' + CONFIG.WIDGET_ID] = handleButtonClick;

      // Click outside to close
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeWidget();
      });

      // Keyboard navigation
      const handleKeydown = (e) => {
        if (e.key === 'Escape') {
          closeWidget();
        } else if (e.key === 'Tab') {
          // Basic focus trap
          const focusable = overlay.querySelectorAll('.aw-focus-trap');
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };
      
      document.addEventListener('keydown', handleKeydown);
      cleanupFunctions.push(() => {
        document.removeEventListener('keydown', handleKeydown);
        delete window['awClose' + CONFIG.WIDGET_ID];
        delete window['awButtonClick' + CONFIG.WIDGET_ID];
      });

      // Append and animate
      document.body.appendChild(overlay);
      
      // Focus management
      const firstFocusable = overlay.querySelector('.aw-focus-trap');
      
      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        container.style.transform = 'scale(1)';
        if (firstFocusable) firstFocusable.focus();
      });

      console.log('Likemetric Widget: Announcement created and displayed');

    } catch (error) {
      handleError(error, 'widget creation');
      widgetShown = false;
    }
  }

  // Initialize triggers based on type with enhanced error handling
  try {
    const triggerType = data.trigger_type;
    
    console.log('Likemetric Widget: Setting up trigger type:', triggerType);
    
    switch (triggerType) {
      case 'auto_show':
        console.log('Likemetric Widget: Auto-show trigger with delay:', data.delay);
        setTimeout(() => {
          console.log('Likemetric Widget: Auto-show delay completed, creating announcement');
          createAnnouncement();
        }, data.delay);
        break;
        
      case 'time_on_page':
        const targetTime = Math.max(1, data.delay / 1000);
        console.log('Likemetric Widget: Time on page trigger with target:', targetTime, 'seconds');
        const timeInterval = setInterval(() => {
          if (!widgetShown && trackTimeOnPage() >= targetTime) {
            createAnnouncement();
            clearInterval(timeInterval);
          }
        }, 1000);
        cleanupFunctions.push(() => clearInterval(timeInterval));
        break;
        
      case 'scroll_percent':
        const targetScroll = Math.max(0, Math.min(100, data.delay || 50));
        console.log('Likemetric Widget: Scroll percent trigger with target:', targetScroll, '%');
        const handleScroll = () => {
          if (!widgetShown && trackScrollPercentage() >= targetScroll) {
            createAnnouncement();
          }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        cleanupFunctions.push(() => window.removeEventListener('scroll', handleScroll));
        break;
        
      case 'exit_intent':
        console.log('Likemetric Widget: Exit intent trigger');
        setupExitIntent();
        break;
        
      default:
        console.log('Likemetric Widget: Unknown trigger type, defaulting to auto-show');
        setTimeout(createAnnouncement, data.delay);
        break;
    }

    // Expose manual trigger for testing
    window.showAnnouncement = () => {
      console.log('Likemetric Widget: Manual trigger called');
      createAnnouncement();
    };
    cleanupFunctions.push(() => delete window.showAnnouncement);

    // Expose refresh function
    window.refreshAnnouncement = () => {
      console.log('Likemetric Widget: Refresh called');
      cleanup();
      widgetShown = false;
      const script = document.createElement('script');
      script.src = CONFIG.API_BASE_URL + '/widget-loader?id=' + CONFIG.WIDGET_ID + '&t=' + Date.now();
      document.head.appendChild(script);
    };
    cleanupFunctions.push(() => delete window.refreshAnnouncement);

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);
    cleanupFunctions.push(() => window.removeEventListener('beforeunload', cleanup));

    console.log('Likemetric Widget: Initialization complete');

  } catch (error) {
    handleError(error, 'initialization');
  }
})();`;

    return new Response(widgetScript, { 
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/javascript',
        'Cache-Control': 'public, max-age=60, s-maxage=60', // Reduced cache time for debugging
        'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval' https:; img-src * data: blob:; media-src * data: blob:;"
      } 
    });

  } catch (error) {
    console.error('Widget loader error:', error);
    return new Response('console.error("Likemetric Widget: Loading failed - " + ' + JSON.stringify(error.message) + ');', { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'text/javascript' } 
    });
  }
});
