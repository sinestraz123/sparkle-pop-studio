
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const tutorialId = url.searchParams.get('id');
    const isTest = url.searchParams.get('test') === '1';

    console.log('Video tutorial widget called:', { tutorialId, isTest });

    if (!tutorialId) {
      return new Response('console.error("Video Tutorial Widget: Missing tutorial ID");', { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'text/javascript' } 
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: tutorial, error } = await supabase
      .from('video_tutorials')
      .select('*')
      .eq('id', tutorialId)
      .single();

    if (error || !tutorial) {
      console.log('Video tutorial not found:', error);
      return new Response('console.warn("Video Tutorial Widget: Tutorial not found");', { 
        headers: { ...corsHeaders, 'Content-Type': 'text/javascript' } 
      });
    }

    // Only check status for non-test requests
    if (!isTest && tutorial.status !== 'active') {
      return new Response('console.warn("Video Tutorial Widget: Tutorial not active");', { 
        headers: { ...corsHeaders, 'Content-Type': 'text/javascript' } 
      });
    }

    console.log('Loading video tutorial:', tutorial.title);

    // Update view count for non-test requests
    if (!isTest) {
      supabase
        .from('video_tutorials')
        .update({ views: (tutorial.views || 0) + 1 })
        .eq('id', tutorialId)
        .then(() => console.log('View count updated'))
        .catch((err) => console.log('Failed to update view count:', err));
    }

    const tutorials = Array.isArray(tutorial.tutorials) ? tutorial.tutorials : [];
    const settings = tutorial.settings || { overlay: true, autoPlay: false, showCloseButton: true };

    const widgetScript = `
(function() {
  console.log('${isTest ? '[TEST] ' : ''}Video Tutorial Widget loading');
  
  const tutorialId = '${tutorialId}';
  const isTestMode = ${isTest};
  
  if (window['vt_' + tutorialId] && !isTestMode) {
    console.log('Video Tutorial Widget already loaded');
    return;
  }
  window['vt_' + tutorialId] = true;

  let widgetVisible = false;

  function createVideoTutorialWidget() {
    if (widgetVisible) return;
    widgetVisible = true;
    
    console.log('${isTest ? '[TEST] ' : ''}Creating video tutorial widget');

    const tutorials = ${JSON.stringify(tutorials)};
    const settings = ${JSON.stringify(settings)};
    
    if (tutorials.length === 0) {
      console.warn('No tutorials found');
      return;
    }

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'vt-overlay-' + tutorialId;
    overlay.style.cssText = \`
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background: rgba(0,0,0,0.8) !important;
      z-index: 999999 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      opacity: 0 !important;
      transition: opacity 0.3s ease !important;
    \`;

    // Create widget container
    const container = document.createElement('div');
    container.style.cssText = \`
      background: white !important;
      border-radius: 12px !important;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important;
      max-width: min(800px, 90vw) !important;
      width: 100% !important;
      max-height: 90vh !important;
      position: relative !important;
      overflow: hidden !important;
      transform: scale(0.9) !important;
      transition: transform 0.3s ease !important;
    \`;

    let currentTutorialIndex = 0;

    function renderTutorial() {
      const tutorial = tutorials[currentTutorialIndex];
      if (!tutorial) return;

      const videoId = tutorial.videoUrl ? tutorial.videoUrl.match(/(?:youtube\\.com\\/watch\\?v=|youtu\\.be\\/)([^&\\n?#]+)/) : null;
      
      let videoContent = '';
      if (videoId && videoId[1]) {
        videoContent = \`
          <div style="aspect-ratio: 16/9 !important; background: #000 !important;">
            <iframe src="https://www.youtube.com/embed/\${videoId[1]}?rel=0\${settings.autoPlay ? '&autoplay=1' : ''}" 
                    style="width: 100% !important; height: 100% !important; border: none !important;" 
                    allowfullscreen></iframe>
          </div>
        \`;
      } else {
        videoContent = \`
          <div style="aspect-ratio: 16/9 !important; background: #f0f0f0 !important; display: flex !important; align-items: center !important; justify-content: center !important;">
            <span style="color: #666 !important;">Video not available</span>
          </div>
        \`;
      }

      const navigation = tutorials.length > 1 ? \`
        <div style="display: flex !important; align-items: center !important; justify-content: space-between !important; margin-top: 16px !important;">
          <button onclick="window.vtPrev\${tutorialId}()" 
                  style="padding: 8px 16px !important; background: #f3f4f6 !important; border: none !important; border-radius: 6px !important; cursor: pointer !important;"
                  \${currentTutorialIndex === 0 ? 'disabled style="opacity: 0.5 !important; cursor: not-allowed !important;"' : ''}>
            Previous
          </button>
          <span style="color: #666 !important; font-size: 14px !important;">
            \${currentTutorialIndex + 1} of \${tutorials.length}
          </span>
          <button onclick="window.vtNext\${tutorialId}()" 
                  style="padding: 8px 16px !important; background: #3b82f6 !important; color: white !important; border: none !important; border-radius: 6px !important; cursor: pointer !important;"
                  \${currentTutorialIndex === tutorials.length - 1 ? 'disabled style="opacity: 0.5 !important; cursor: not-allowed !important;"' : ''}>
            Next
          </button>
        </div>
      \` : '';

      container.innerHTML = \`
        \${settings.showCloseButton ? \`
          <button onclick="window.vtClose\${tutorialId}()" 
                  style="position: absolute !important; top: 16px !important; right: 16px !important; 
                         background: rgba(0,0,0,0.5) !important; color: white !important; border: none !important; 
                         width: 32px !important; height: 32px !important; border-radius: 16px !important; 
                         cursor: pointer !important; z-index: 10 !important; font-size: 18px !important;">×</button>
        \` : ''}
        \${videoContent}
        <div style="padding: 24px !important;">
          <h3 style="margin: 0 0 8px 0 !important; font-size: 20px !important; font-weight: bold !important;">
            \${tutorial.title || 'Video Tutorial'}
          </h3>
          \${tutorial.description ? \`
            <p style="margin: 0 !important; color: #666 !important; line-height: 1.5 !important;">
              \${tutorial.description}
            </p>
          \` : ''}
          \${navigation}
        </div>
      \`;
    }

    // Navigation functions
    window['vtNext' + tutorialId] = function() {
      if (currentTutorialIndex < tutorials.length - 1) {
        currentTutorialIndex++;
        renderTutorial();
      }
    };

    window['vtPrev' + tutorialId] = function() {
      if (currentTutorialIndex > 0) {
        currentTutorialIndex--;
        renderTutorial();
      }
    };

    window['vtClose' + tutorialId] = function() {
      overlay.style.opacity = '0';
      container.style.transform = 'scale(0.9)';
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        widgetVisible = false;
      }, 300);
    };

    // Close on overlay click
    overlay.onclick = function(e) {
      if (e.target === overlay) {
        window['vtClose' + tutorialId]();
      }
    };

    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && widgetVisible) {
        window['vtClose' + tutorialId]();
      }
    });

    renderTutorial();
    overlay.appendChild(container);
    document.body.appendChild(overlay);
    
    // Animate in
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      container.style.transform = 'scale(1)';
    });

    console.log('${isTest ? '[TEST] ' : ''}Video tutorial widget created');
  }

  // Create floating button if not in test mode
  if (!isTestMode) {
    const button = document.createElement('button');
    button.innerHTML = '📺 Video Tutorials';
    button.style.cssText = \`
      position: fixed !important;
      bottom: 20px !important;
      right: 20px !important;
      background: #3b82f6 !important;
      color: white !important;
      border: none !important;
      padding: 12px 20px !important;
      border-radius: 25px !important;
      cursor: pointer !important;
      font-weight: 600 !important;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
      z-index: 999998 !important;
      font-size: 14px !important;
      transition: transform 0.2s ease !important;
    \`;
    
    button.onmouseover = () => button.style.transform = 'scale(1.05)';
    button.onmouseout = () => button.style.transform = 'scale(1)';
    button.onclick = createVideoTutorialWidget;
    
    document.body.appendChild(button);
  } else {
    // For test mode, create widget immediately
    setTimeout(createVideoTutorialWidget, 500);
  }

  // Expose manual trigger
  window.showVideoTutorials = createVideoTutorialWidget;
})();`;

    return new Response(widgetScript, { 
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/javascript',
        'Cache-Control': 'no-cache'
      } 
    });

  } catch (error) {
    console.error('Video tutorial widget error:', error);
    return new Response(`console.error("Video Tutorial Widget failed: ${error.message}");`, { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'text/javascript' } 
    });
  }
});
