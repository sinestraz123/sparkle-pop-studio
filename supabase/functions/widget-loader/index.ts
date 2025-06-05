
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { sanitizeHtml, isValidUrl, generateWidgetScript } from './utils.ts'

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

    const widgetScript = generateWidgetScript(data, announcementId, isTest);

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
