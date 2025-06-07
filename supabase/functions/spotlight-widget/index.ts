
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const spotlightId = url.searchParams.get('id')
    const action = url.searchParams.get('action') || 'view'

    if (!spotlightId) {
      return new Response('Missing spotlight ID', { status: 400, headers: corsHeaders })
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (action === 'click') {
      // Track click
      await supabaseClient
        .from('spotlights')
        .update({ clicks: supabaseClient.raw('clicks + 1') })
        .eq('id', spotlightId)

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get spotlight data
    const { data: spotlight, error } = await supabaseClient
      .from('spotlights')
      .select('*')
      .eq('id', spotlightId)
      .eq('status', 'published')
      .single()

    if (error || !spotlight) {
      return new Response('Spotlight not found', { status: 404, headers: corsHeaders })
    }

    if (action === 'view') {
      // Track view
      await supabaseClient
        .from('spotlights')
        .update({ views: supabaseClient.raw('views + 1') })
        .eq('id', spotlightId)
    }

    const getVideoEmbedUrl = (url: string) => {
      if (!url) return '';
      
      // YouTube
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const youtubeMatch = url.match(youtubeRegex);
      if (youtubeMatch) {
        return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
      }
      
      // Vimeo
      const vimeoRegex = /vimeo\.com\/(?:.*#|.*\/videos\/)?([0-9]+)/;
      const vimeoMatch = url.match(vimeoRegex);
      if (vimeoMatch) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
      }
      
      return url;
    };

    const embedUrl = getVideoEmbedUrl(spotlight.video_url);
    const isDirectVideo = !embedUrl.includes('youtube.com') && !embedUrl.includes('vimeo.com');

    const widgetScript = `
      (function() {
        const spotlightData = ${JSON.stringify(spotlight)};
        
        function createSpotlightButton() {
          const button = document.createElement('button');
          button.innerHTML = '🎬 Watch ${spotlight.title}';
          button.style.cssText = \`
            background: #3b82f6;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
          \`;
          
          button.addEventListener('mouseenter', () => {
            button.style.background = '#2563eb';
            button.style.transform = 'translateY(-2px)';
          });
          
          button.addEventListener('mouseleave', () => {
            button.style.background = '#3b82f6';
            button.style.transform = 'translateY(0)';
          });
          
          button.addEventListener('click', showSpotlight);
          return button;
        }
        
        function showSpotlight() {
          // Track click
          fetch('${url.origin}/functions/v1/spotlight-widget?id=${spotlightId}&action=click', {
            method: 'GET'
          });
          
          const overlay = document.createElement('div');
          overlay.style.cssText = \`
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
          \`;
          
          const modal = document.createElement('div');
          modal.style.cssText = \`
            background: white;
            border-radius: 12px;
            max-width: 90vw;
            max-height: 90vh;
            width: 800px;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
            position: relative;
          \`;
          
          const closeButton = document.createElement('button');
          closeButton.innerHTML = '×';
          closeButton.style.cssText = \`
            position: absolute;
            top: 16px;
            right: 16px;
            background: rgba(0, 0, 0, 0.1);
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            z-index: 10001;
            color: #666;
          \`;
          
          const videoContainer = document.createElement('div');
          videoContainer.style.cssText = \`
            width: 100%;
            height: 450px;
            background: black;
            position: relative;
          \`;
          
          ${isDirectVideo ? `
            const video = document.createElement('video');
            video.src = '${embedUrl}';
            video.controls = true;
            video.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
            videoContainer.appendChild(video);
          ` : `
            const iframe = document.createElement('iframe');
            iframe.src = '${embedUrl}';
            iframe.style.cssText = 'width: 100%; height: 100%; border: 0;';
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.allowFullscreen = true;
            videoContainer.appendChild(iframe);
          `}
          
          const titleContainer = document.createElement('div');
          titleContainer.style.cssText = 'padding: 24px;';
          
          const title = document.createElement('h2');
          title.textContent = spotlightData.title;
          title.style.cssText = \`
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            color: #111;
          \`;
          
          titleContainer.appendChild(title);
          modal.appendChild(videoContainer);
          modal.appendChild(titleContainer);
          modal.appendChild(closeButton);
          overlay.appendChild(modal);
          
          closeButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
          });
          
          overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
              document.body.removeChild(overlay);
            }
          });
          
          document.body.appendChild(overlay);
          
          const style = document.createElement('style');
          style.textContent = \`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          \`;
          document.head.appendChild(style);
        }
        
        // Auto-create button if container exists
        const container = document.getElementById('spotlight-${spotlightId}');
        if (container) {
          container.appendChild(createSpotlightButton());
        }
        
        // Make button creation available globally
        window.createSpotlightButton = createSpotlightButton;
      })();
    `;

    return new Response(widgetScript, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=3600',
      },
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response('Internal server error', { status: 500, headers: corsHeaders })
  }
})
