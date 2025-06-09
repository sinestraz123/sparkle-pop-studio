
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const { bannerId } = await req.json();

    if (!bannerId) {
      return new Response('Banner ID is required', { status: 400, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Update click count
    const { error } = await supabase
      .from('banners')
      .update({ 
        clicks: supabase.rpc('increment_clicks', { banner_id: bannerId })
      })
      .eq('id', bannerId);

    if (error) {
      console.error('Error updating click count:', error);
      return new Response('Error updating click count', { status: 500, headers: corsHeaders });
    }

    return new Response('Click tracked', { headers: corsHeaders });
  } catch (error) {
    console.error('Banner click tracking error:', error);
    return new Response('Internal server error', { status: 500, headers: corsHeaders });
  }
});
