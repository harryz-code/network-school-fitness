-- Create weight_history table for comprehensive fitness tracking
CREATE TABLE IF NOT EXISTS weight_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  body_fat DECIMAL(4,1),
  lean_mass DECIMAL(5,2),
  goal_distance_weight DECIMAL(5,2),
  goal_distance_body_fat DECIMAL(4,1),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE weight_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own weight history" ON weight_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weight history" ON weight_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weight history" ON weight_history
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weight history" ON weight_history
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_weight_history_user_date ON weight_history(user_id, date DESC);
