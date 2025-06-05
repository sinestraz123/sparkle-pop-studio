
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
  // Escape data for safe injection into JavaScript
  const escapeForJs = (str: string) => {
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
  };

  const safeData = {
    title: escapeForJs(data.title || ''),
    description: escapeForJs(data.description || ''),
    button_text: escapeForJs(data.button_text || ''),
    button_url: data.button_url || '',
    button_action: data.button_action || 'url',
    image_url: data.image_url || '',
    video_url: data.video_url || '',
    background_color: data.background_color || '#ffffff',
    text_color: data.text_color || '#000000',
    button_color: data.button_color || '#000000',
    show_close_button: data.show_close_button !== false,
    trigger_type: data.trigger_type || 'auto_show',
    delay: Math.max(0, Math.min(60000, data.delay || 2000))
  };

  return `
(function() {
  const widgetId = '${announcementId}';
  const isTestMode = ${isTest};
  
  console.log('${isTest ? '[TEST] ' : ''}Widget loading for ID:', widgetId);
  
  // Prevent duplicate widgets unless in test mode
  if (window['aw_loaded_' + widgetId] && !isTestMode) {
    console.log('Widget already loaded for ID:', widgetId);
    return;
  }
  window['aw_loaded_' + widgetId] = true;

  let widgetShown = false;
  let widgetContainer = null;

  function trackClick() {
    console.log('Widget: Button clicked for ID:', widgetId);
    fetch('https://qpelvplxusbfyacgipgp.supabase.co/functions/v1/widget-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ announcementId: widgetId })
    }).catch(e => console.warn('Widget: Click tracking failed:', e));
  }

  function closeWidget() {
    console.log('Widget: Closing widget');
    const overlay = document.getElementById('aw-overlay-' + widgetId);
    if (overlay) {
      overlay.style.opacity = '0';
      overlay.style.transform = 'scale(0.95)';
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        widgetShown = false;
        widgetContainer = null;
      }, 300);
    }
  }

  function waitForBody(callback, maxAttempts = 100) {
    let attempts = 0;
    const checkBody = () => {
      attempts++;
      if (document.body) {
        callback();
      } else if (attempts < maxAttempts) {
        setTimeout(checkBody, 50);
      } else {
        console.warn('Widget: Body element not found after maximum attempts');
      }
    };
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkBody);
    } else {
      checkBody();
    }
  }

  function injectStyles() {
    // Remove any existing widget styles
    const existingStyle = document.getElementById('aw-styles-' + widgetId);
    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement('style');
    style.id = 'aw-styles-' + widgetId;
    style.textContent = \`
      /* Widget overlay with maximum isolation */
      #aw-overlay-\${widgetId} {
        all: initial !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background: rgba(0, 0, 0, 0.6) !important;
        z-index: 2147483647 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        opacity: 0 !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        pointer-events: auto !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
        box-sizing: border-box !important;
        user-select: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        transform: scale(0.95) !important;
      }
      
      #aw-overlay-\${widgetId} * {
        box-sizing: border-box !important;
        pointer-events: auto !important;
        user-select: text !important;
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
      }
      
      #aw-overlay-\${widgetId} .aw-container {
        all: initial !important;
        background: ${safeData.background_color} !important;
        color: ${safeData.text_color} !important;
        border-radius: 16px !important;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
        max-width: min(420px, 90vw) !important;
        width: 100% !important;
        position: relative !important;
        overflow: hidden !important;
        pointer-events: auto !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
        box-sizing: border-box !important;
        transform: none !important;
        opacity: 1 !important;
      }
      
      #aw-overlay-\${widgetId} .aw-close {
        all: initial !important;
        position: absolute !important;
        top: 16px !important;
        right: 16px !important;
        background: rgba(0, 0, 0, 0.1) !important;
        border: none !important;
        border-radius: 50% !important;
        font-size: 20px !important;
        cursor: pointer !important;
        color: ${safeData.text_color} !important;
        width: 32px !important;
        height: 32px !important;
        pointer-events: auto !important;
        z-index: 2147483647 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
        transition: all 0.2s ease !important;
        line-height: 1 !important;
        font-weight: 400 !important;
      }
      
      #aw-overlay-\${widgetId} .aw-close:hover {
        background: rgba(0, 0, 0, 0.2) !important;
        transform: scale(1.1) !important;
      }
      
      #aw-overlay-\${widgetId} .aw-button {
        all: initial !important;
        width: 100% !important;
        padding: 16px 24px !important;
        background: ${safeData.button_color} !important;
        color: white !important;
        border: none !important;
        border-radius: 12px !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        margin-top: 20px !important;
        font-size: 16px !important;
        pointer-events: auto !important;
        display: block !important;
        text-align: center !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
        box-sizing: border-box !important;
        transition: all 0.2s ease !important;
        line-height: 1.5 !important;
        text-decoration: none !important;
      }
      
      #aw-overlay-\${widgetId} .aw-button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
        filter: brightness(1.05) !important;
      }
      
      #aw-overlay-\${widgetId} .aw-content {
        all: initial !important;
        padding: 28px !important;
        pointer-events: auto !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
        box-sizing: border-box !important;
      }
      
      #aw-overlay-\${widgetId} .aw-title {
        all: initial !important;
        font-size: 24px !important;
        font-weight: 700 !important;
        margin: 0 0 12px 0 !important;
        line-height: 1.3 !important;
        color: ${safeData.text_color} !important;
        display: block !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
      }
      
      #aw-overlay-\${widgetId} .aw-description {
        all: initial !important;
        font-size: 16px !important;
        line-height: 1.5 !important;
        margin: 0 !important;
        opacity: 0.9 !important;
        color: ${safeData.text_color} !important;
        display: block !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
      }
      
      #aw-overlay-\${widgetId} .aw-media {
        all: initial !important;
        aspect-ratio: 16/9 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: #f8f9fa !important;
        pointer-events: auto !important;
        box-sizing: border-box !important;
        border-radius: 12px !important;
        overflow: hidden !important;
        margin-bottom: 20px !important;
      }
      
      #aw-overlay-\${widgetId} .aw-media img {
        all: initial !important;
        max-width: 100% !important;
        max-height: 100% !important;
        object-fit: cover !important;
        pointer-events: auto !important;
        border-radius: 12px !important;
      }
      
      #aw-overlay-\${widgetId} .aw-media iframe {
        all: initial !important;
        width: 100% !important;
        height: 100% !important;
        border: none !important;
        pointer-events: auto !important;
        border-radius: 12px !important;
      }
      
      /* Show state */
      #aw-overlay-\${widgetId}.aw-show {
        opacity: 1 !important;
        transform: scale(1) !important;
      }
    \`;
    
    document.head.appendChild(style);
    console.log('Widget: Styles injected for ID:', widgetId);
  }

  function createWidget() {
    if (widgetShown) {
      console.log('Widget: Already shown for ID:', widgetId);
      return;
    }
    
    console.log('${isTest ? '[TEST] ' : ''}Widget: Creating widget for ID:', widgetId);
    widgetShown = true;
    
    waitForBody(() => {
      // Remove any existing widget
      const existingWidget = document.getElementById('aw-overlay-' + widgetId);
      if (existingWidget) {
        existingWidget.remove();
      }

      // Inject styles
      injectStyles();

      // Create widget elements
      const overlay = document.createElement('div');
      overlay.id = 'aw-overlay-' + widgetId;
      
      const container = document.createElement('div');
      container.className = 'aw-container';

      // Build content HTML
      let contentHtml = '';
      
      // Close button
      if (${safeData.show_close_button}) {
        contentHtml += '<button class="aw-close" type="button" aria-label="Close">×</button>';
      }

      // Media content
      if ('${safeData.video_url}') {
        const videoMatch = '${safeData.video_url}'.match(/(?:youtube\\.com\\/watch\\?v=|youtu\\.be\\/)([^&\\n?#]+)/);
        if (videoMatch && videoMatch[1]) {
          contentHtml += \`
            <div class="aw-media">
              <iframe src="https://www.youtube.com/embed/\${videoMatch[1]}?rel=0&autoplay=0" 
                      allowfullscreen 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      title="Video"></iframe>
            </div>
          \`;
        }
      } else if ('${safeData.image_url}') {
        contentHtml += \`
          <div class="aw-media">
            <img src="${safeData.image_url}" alt="Announcement" loading="lazy" />
          </div>
        \`;
      }

      // Text content
      contentHtml += \`
        <div class="aw-content">
          <h2 class="aw-title">${safeData.title}</h2>
          <p class="aw-description">${safeData.description}</p>
      \`;

      // Button
      if ('${safeData.button_text}') {
        contentHtml += \`<button class="aw-button" type="button">${safeData.button_text}</button>\`;
      }

      contentHtml += '</div>';

      container.innerHTML = contentHtml;
      overlay.appendChild(container);

      // Event handling with delegation
      overlay.addEventListener('click', function(e) {
        console.log('Widget: Click detected on element:', e.target.className);
        
        if (e.target === overlay) {
          // Clicked on overlay background
          closeWidget();
        } else if (e.target.classList.contains('aw-close')) {
          // Clicked close button
          e.preventDefault();
          e.stopPropagation();
          closeWidget();
        } else if (e.target.classList.contains('aw-button')) {
          // Clicked action button
          e.preventDefault();
          e.stopPropagation();
          trackClick();
          
          if ('${safeData.button_action}' === 'close') {
            closeWidget();
          } else if ('${safeData.button_action}' === 'url' && '${safeData.button_url}') {
            window.open('${safeData.button_url}', '_blank', 'noopener,noreferrer');
            closeWidget();
          }
        }
      });

      // Keyboard handling
      const handleKeydown = (e) => {
        if (e.key === 'Escape') {
          closeWidget();
          document.removeEventListener('keydown', handleKeydown);
        }
      };
      document.addEventListener('keydown', handleKeydown);

      // Append to body
      document.body.appendChild(overlay);
      widgetContainer = overlay;

      // Show with animation
      requestAnimationFrame(() => {
        overlay.classList.add('aw-show');
        console.log('${isTest ? '[TEST] ' : ''}Widget: Successfully displayed for ID:', widgetId);
      });
    });
  }

  function initializeWidget() {
    const triggerType = '${safeData.trigger_type}';
    const delay = ${safeData.delay};

    console.log('Widget: Initializing with trigger:', triggerType, 'delay:', delay);

    if (isTestMode) {
      console.log('[TEST] Widget: Creating widget immediately for testing');
      setTimeout(createWidget, 1000);
      return;
    }

    switch (triggerType) {
      case 'auto_show':
      case 'time_on_page':
        setTimeout(createWidget, delay);
        break;
        
      case 'scroll_percent':
        const targetPercent = delay || 50;
        const handleScroll = () => {
          const scrollPercent = Math.round(
            (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100
          );
          if (scrollPercent >= targetPercent) {
            createWidget();
            window.removeEventListener('scroll', handleScroll);
          }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        break;
        
      case 'exit_intent':
        let exitIntentTriggered = false;
        const handleMouseLeave = (e) => {
          if (!exitIntentTriggered && e.clientY <= 0) {
            exitIntentTriggered = true;
            createWidget();
            document.removeEventListener('mouseleave', handleMouseLeave);
          }
        };
        document.addEventListener('mouseleave', handleMouseLeave);
        break;
        
      default:
        setTimeout(createWidget, delay);
    }

    // Global function for manual triggering
    window.showAnnouncement = createWidget;
    window.hideAnnouncement = closeWidget;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWidget);
  } else {
    initializeWidget();
  }

  console.log('Widget: Script loaded for ID:', widgetId);
})();`;
}
