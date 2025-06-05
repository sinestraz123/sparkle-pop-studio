
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}

export function generateWidgetScript(data: any, announcementId: string, isTest: boolean): string {
  return `
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
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
      } else {
        const checkForBody = setInterval(() => {
          if (document.body) {
            clearInterval(checkForBody);
            callback();
          }
        }, 10);
        
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

    window.showAnnouncement = createWidget;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWidget);
  } else {
    initializeWidget();
  }
})();`;
}
