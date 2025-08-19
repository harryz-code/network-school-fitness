-- Update profiles table to add missing columns
-- Run this in your Supabase SQL Editor

-- Add missing columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS daily_deficit INTEGER DEFAULT 500,
ADD COLUMN IF NOT EXISTS workout_split INTEGER DEFAULT 50,
ADD COLUMN IF NOT EXISTS protein INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS carbs INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS fat INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS body_fat DECIMAL(4,1) DEFAULT NULL;

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position; 