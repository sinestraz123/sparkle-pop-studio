
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const bannerId = url.searchParams.get('id');
    const isTest = url.searchParams.get('test') === '1';

    console.log('Banner widget loader called:', { bannerId, isTest });

    if (!bannerId) {
      return new Response('console.error("Banner Widget: Missing banner ID");', { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'text/javascript' } 
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: banner, error } = await supabase
      .from('banners')
      .select('*')
      .eq('id', bannerId)
      .single();

    if (error || !banner) {
      console.log('Banner not found:', error);
      return new Response('console.warn("Banner Widget: Banner not found");', { 
        headers: { ...corsHeaders, 'Content-Type': 'text/javascript' } 
      });
    }

    // Only check status for non-test requests
    if (!isTest && banner.status !== 'active') {
      return new Response('console.warn("Banner Widget: Banner not active");', { 
        headers: { ...corsHeaders, 'Content-Type': 'text/javascript' } 
      });
    }

    console.log('Loading banner:', banner.title);

    // Update view count
    if (!isTest) {
      supabase
        .from('banners')
        .update({ views: (banner.views || 0) + 1 })
        .eq('id', bannerId)
        .then(() => console.log('View count updated'))
        .catch((err) => console.log('Failed to update view count:', err));
    }

    const data = {
      title: sanitizeHtml(banner.title || ''),
      content: sanitizeHtml(banner.content || ''),
      button_text: sanitizeHtml(banner.button_text || ''),
      button_url: banner.button_url || '',
      background_color: banner.background_color || '#000000',
      text_color: banner.text_color || '#ffffff',
      show_button: banner.show_button !== false,
      show_dismiss: banner.show_dismiss !== false,
      show_sender: banner.show_sender !== false,
      sender_name: sanitizeHtml(banner.sender_name || ''),
      style: banner.style || 'floating',
      position: banner.position || 'top',
      action_type: banner.action_type || 'none'
    };

    const widgetScript = `
(function() {
  console.log('${isTest ? '[TEST] ' : ''}Banner loading:', '${data.title}');
  
  const bannerId = '${bannerId}';
  const isTestMode = ${isTest};
  
  if (window['bw_' + bannerId] && !isTestMode) {
    console.log('Banner already loaded');
    return;
  }
  window['bw_' + bannerId] = true;

  function trackClick() {
    console.log('Banner Widget: Button clicked');
    fetch('https://qpelvplxusbfyacgipgp.supabase.co/functions/v1/banner-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bannerId: bannerId })
    }).catch(console.warn);
  }

  function closeBanner() {
    const banner = document.getElementById('bw-' + bannerId);
    if (banner) {
      banner.style.opacity = '0';
      setTimeout(() => {
        if (banner.parentNode) banner.parentNode.removeChild(banner);
      }, 200);
    }
  }

  function createBanner() {
    console.log('${isTest ? '[TEST] ' : ''}Creating banner');

    const banner = document.createElement('div');
    banner.id = 'bw-' + bannerId;
    banner.style.cssText = \`
      position: fixed !important;
      ${data.position}: 0 !important;
      left: 0 !important;
      right: 0 !important;
      z-index: 999999 !important;
      background: ${data.background_color} !important;
      color: ${data.text_color} !important;
      padding: 12px 16px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 14px !important;
      line-height: 1.4 !important;
      transition: opacity 0.2s ease !important;
      ${data.style === 'floating' ? 'margin: 16px !important; border-radius: 8px !important;' : ''}
    \`;

    let senderSection = '';
    if (${data.show_sender} && '${data.sender_name}') {
      senderSection = \`
        <div style="display: flex !important; align-items: center !important; gap: 8px !important; margin-right: 16px !important;">
          <div style="width: 24px !important; height: 24px !important; background: rgba(255,255,255,0.2) !important; border-radius: 50% !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 12px !important; font-weight: bold !important;">
            ${data.sender_name.split(' ').map(n => n[0]).join('').substring(0, 2)}
          </div>
          <span style="font-weight: 500 !important;">${data.sender_name}</span>
        </div>
      \`;
    }

    let actionSection = '';
    if ('${data.action_type}' === 'open_url_button' && ${data.show_button} && '${data.button_text}') {
      actionSection = \`
        <button onclick="window.bwButton\${bannerId}()" 
                style="padding: 8px 16px !important; background: rgba(255,255,255,0.2) !important; color: ${data.text_color} !important; border: none !important; border-radius: 4px !important; cursor: pointer !important; font-size: 14px !important; font-weight: 500 !important; margin-left: 16px !important;">
          ${data.button_text}
        </button>
      \`;
    } else if ('${data.action_type}' === 'collect_emails') {
      actionSection = \`
        <div style="display: flex !important; align-items: center !important; gap: 8px !important; margin-left: 16px !important;">
          <input type="email" placeholder="Enter your email" 
                 style="padding: 8px 12px !important; background: rgba(255,255,255,0.2) !important; border: 1px solid rgba(255,255,255,0.3) !important; border-radius: 4px !important; color: ${data.text_color} !important; font-size: 14px !important; min-width: 200px !important;" />
          <button onclick="window.bwSubmit\${bannerId}()" 
                  style="padding: 8px 16px !important; background: rgba(255,255,255,0.2) !important; color: ${data.text_color} !important; border: none !important; border-radius: 4px !important; cursor: pointer !important; font-size: 14px !important; font-weight: 500 !important;">
            Submit
          </button>
        </div>
      \`;
    }

    let dismissButton = '';
    if (${data.show_dismiss}) {
      dismissButton = \`
        <button onclick="window.bwClose\${bannerId}()" 
                style="background: none !important; border: none !important; color: ${data.text_color} !important; cursor: pointer !important; font-size: 18px !important; padding: 4px !important; margin-left: 16px !important;">×</button>
      \`;
    }

    banner.innerHTML = \`
      <div style="display: flex !important; align-items: center !important; flex: 1 !important;">
        \${senderSection}
        <span style="flex: 1 !important;">${data.title}</span>
      </div>
      \${actionSection}
      \${dismissButton}
    \`;

    window['bwClose' + bannerId] = closeBanner;
    window['bwButton' + bannerId] = function() {
      trackClick();
      if ('${data.button_url}') {
        window.open('${data.button_url}', '_blank');
      }
    };

    document.body.appendChild(banner);
    
    console.log('${isTest ? '[TEST] ' : ''}Banner created and displayed');
  }

  // Create banner immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createBanner);
  } else {
    createBanner();
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
    console.error('Banner widget loader error:', error);
    return new Response(`console.error("Banner widget loading failed: ${error.message}");`, { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'text/javascript' } 
    });
  }
});
