
-- Create video_tutorials table
CREATE TABLE public.video_tutorials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  tutorials JSONB NOT NULL DEFAULT '[]'::jsonb,
  settings JSONB NOT NULL DEFAULT '{
    "showCloseButton": true,
    "autoPlay": false,
    "overlay": true
  }'::jsonb,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active')),
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.video_tutorials ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own video tutorials" ON public.video_tutorials
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own video tutorials" ON public.video_tutorials
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own video tutorials" ON public.video_tutorials
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own video tutorials" ON public.video_tutorials
  FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.video_tutorials
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
