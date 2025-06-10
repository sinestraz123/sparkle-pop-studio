
-- Create feedback_widgets table
CREATE TABLE feedback_widgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  steps JSONB NOT NULL,
  background_color TEXT DEFAULT '#2563eb',
  text_color TEXT DEFAULT '#ffffff', 
  button_color TEXT DEFAULT '#ffffff',
  position TEXT DEFAULT 'bottom-center' CHECK (position IN ('bottom-left', 'bottom-center', 'bottom-right')),
  show_close_button BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active')),
  views INTEGER DEFAULT 0,
  responses INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies
ALTER TABLE feedback_widgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own feedback widgets" ON feedback_widgets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feedback widgets" ON feedback_widgets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own feedback widgets" ON feedback_widgets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own feedback widgets" ON feedback_widgets
  FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON feedback_widgets
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
