
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    const tutorialId = url.searchParams.get('id');
    const isTest = url.searchParams.get('test') === '1';

    console.log('Video tutorial widget called:', { tutorialId, isTest });

    if (!tutorialId) {
      return new Response('console.error("Video Tutorial Widget: Missing tutorial ID");', { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'text/javascript' } 
      });
    }

    // For now, using mock data - in real implementation, fetch from Supabase
    const mockData = {
      id: tutorialId,
      title: 'Video Tutorials',
      tutorials: [
        {
          id: '1',
          title: 'How to start a document and build an outline with Glyph AI',
          description: 'Learn how to submit a document prompt and accept an autocomplete',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        }
      ],
      settings: {
        showCloseButton: true,
        autoPlay: false,
        overlay: true
      }
    };

    const data = {
      title: sanitizeHtml(mockData.title || 'Video Tutorials'),
      tutorials: mockData.tutorials.map((tutorial: any) => ({
        id: tutorial.id,
        title: sanitizeHtml(tutorial.title || ''),
        description: sanitizeHtml(tutorial.description || ''),
        videoUrl: tutorial.videoUrl && isValidUrl(tutorial.videoUrl) ? tutorial.videoUrl : ''
      })),
      showCloseButton: mockData.settings.showCloseButton !== false,
      autoPlay: mockData.settings.autoPlay === true,
      overlay: mockData.settings.overlay !== false
    };

    const widgetScript = `
(function() {
  console.log('${isTest ? '[TEST] ' : ''}Video Tutorial Widget loading');
  
  const widgetId = '${tutorialId}';
  const isTestMode = ${isTest};
  
  if (window['vt_' + widgetId] && !isTestMode) {
    console.log('Video Tutorial Widget already loaded');
    return;
  }
  window['vt_' + widgetId] = true;

  let widgetShown = false;
  let buttonCreated = false;

  function createTriggerButton() {
    if (buttonCreated) return;
    buttonCreated = true;

    const button = document.createElement('button');
    button.id = 'vt-trigger-' + widgetId;
    button.innerHTML = '📺 Video Tutorials';
    button.style.cssText = \`
      position: fixed !important;
      bottom: 20px !important;
      right: 20px !important;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white !important;
      border: none !important;
      border-radius: 50px !important;
      padding: 12px 20px !important;
      font-weight: 600 !important;
      cursor: pointer !important;
      z-index: 999998 !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
      transition: all 0.3s ease !important;
      font-size: 14px !important;
    \`;

    button.onmouseover = () => {
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
    };

    button.onmouseout = () => {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    };

    button.onclick = showWidget;
    document.body.appendChild(button);
  }

  function closeWidget() {
    const overlay = document.getElementById('vt-' + widgetId);
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        widgetShown = false;
      }, 200);
    }
  }

  function showWidget() {
    if (widgetShown) return;
    widgetShown = true;
    
    console.log('${isTest ? '[TEST] ' : ''}Creating video tutorial widget');

    const overlay = document.createElement('div');
    overlay.id = 'vt-' + widgetId;
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
    \`;

    const container = document.createElement('div');
    container.style.cssText = \`
      background: white !important;
      border-radius: 12px !important;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important;
      max-width: min(600px, 90vw) !important;
      width: 100% !important;
      max-height: 70vh !important;
      position: relative !important;
      overflow: hidden !important;
      transform: scale(0.9) !important;
      transition: transform 0.2s ease !important;
    \`;

    let closeBtn = '';
    if (${data.showCloseButton}) {
      closeBtn = \`
        <button onclick="window.vtClose\${widgetId}()" 
                style="position: absolute !important; top: 12px !important; right: 12px !important; 
                       background: none !important; border: none !important; font-size: 24px !important; 
                       cursor: pointer !important; color: #666 !important; 
                       width: 32px !important; height: 32px !important; z-index: 10 !important;">×</button>
      \`;
    }

    const tutorials = ${JSON.stringify(data.tutorials)};
    let tutorialsHtml = '';

    tutorials.forEach((tutorial, index) => {
      const isFirstTutorial = index === 0;
      tutorialsHtml += \`
        <div class="tutorial-item" style="border-bottom: 1px solid #e5e7eb; \${index === tutorials.length - 1 ? 'border-bottom: none;' : ''}" data-tutorial-id="\${tutorial.id}">
          <div class="tutorial-header" style="padding: 16px 24px; cursor: pointer; display: flex; align-items: center; gap: 12px;" onclick="toggleTutorial('\${tutorial.id}')">
            <div class="tutorial-icon" style="width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;">
              <span style="transform: \${isFirstTutorial ? 'rotate(180deg)' : 'rotate(0deg)'}; transition: transform 0.2s ease;">▼</span>
            </div>
            <div style="flex: 1;">
              <h3 style="font-weight: 600; font-size: 14px; margin: 0; line-height: 1.4;">\${tutorial.title}</h3>
              <p style="font-size: 12px; color: #6b7280; margin: 4px 0 0 0; line-height: 1.3;">\${tutorial.description}</p>
            </div>
          </div>
          <div class="tutorial-content" style="padding: 0 24px 16px; display: \${isFirstTutorial ? 'block' : 'none'};">
            \${tutorial.videoUrl ? \`
              <div style="aspect-ratio: 16/9; background: #000; border-radius: 8px; overflow: hidden;">
                <iframe src="\${tutorial.videoUrl}\${${data.autoPlay} && isFirstTutorial ? '?autoplay=1' : ''}" 
                        style="width: 100%; height: 100%; border: none;" 
                        allowfullscreen></iframe>
              </div>
            \` : \`
              <div style="aspect-ratio: 16/9; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; position: relative;">
                <div style="text-center; color: white;">
                  <div style="font-size: 48px; margin-bottom: 16px;">▶</div>
                  <div style="font-size: 24px; font-weight: bold;">Glyph AI</div>
                  <div style="font-size: 14px; opacity: 0.8; margin-top: 4px;">//Tutorial</div>
                  <div style="font-size: 18px; font-weight: 600; margin-top: 8px;">Start a New Document</div>
                </div>
              </div>
            \`}
          </div>
        </div>
      \`;
    });

    container.innerHTML = \`
      \${closeBtn}
      <div style="border-bottom: 1px solid #e5e7eb; padding: 20px 24px; background: white;">
        <h2 style="font-size: 18px; font-weight: 700; margin: 0;">Video Tutorials</h2>
      </div>
      <div style="max-height: 400px; overflow-y: auto;">
        \${tutorialsHtml}
      </div>
    \`;

    overlay.appendChild(container);

    window['vtClose' + widgetId] = closeWidget;
    
    window.toggleTutorial = function(tutorialId) {
      const tutorial = container.querySelector(\`[data-tutorial-id="\${tutorialId}"]\`);
      const content = tutorial.querySelector('.tutorial-content');
      const icon = tutorial.querySelector('.tutorial-icon span');
      
      const isVisible = content.style.display === 'block';
      
      // Close all tutorials
      container.querySelectorAll('.tutorial-content').forEach(c => c.style.display = 'none');
      container.querySelectorAll('.tutorial-icon span').forEach(i => i.style.transform = 'rotate(0deg)');
      
      // Open clicked tutorial if it was closed
      if (!isVisible) {
        content.style.display = 'block';
        icon.style.transform = 'rotate(180deg)';
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

    console.log('${isTest ? '[TEST] ' : ''}Video tutorial widget created and displayed');
  }

  // Create trigger button
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createTriggerButton);
  } else {
    createTriggerButton();
  }

  // Expose manual trigger
  window.showVideoTutorials = showWidget;
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
    return new Response(`console.error("Video tutorial widget loading failed: ${error.message}");`, { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'text/javascript' } 
    });
  }
});
