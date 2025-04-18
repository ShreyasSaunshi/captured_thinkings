/*
  # Create poems table and setup security policies

  1. New Tables
    - `poems`
      - `id` (uuid, primary key)
      - `title` (text)
      - `subtitle` (text, nullable)
      - `content` (text)
      - `cover_image` (text)
      - `language` (text)
      - `is_listed` (boolean)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
      - `user_id` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on `poems` table
    - Add policies for:
      - Public read access to listed poems
      - Authenticated users (admin) can perform all operations
*/

-- Create poems table
CREATE TABLE IF NOT EXISTS poems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  content text NOT NULL,
  cover_image text NOT NULL,
  language text NOT NULL CHECK (language IN ('english', 'kannada')),
  is_listed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow public read access to listed poems
CREATE POLICY "Public can view listed poems"
  ON poems
  FOR SELECT
  TO public
  USING (is_listed = true);

-- Allow authenticated users (admin) to perform all operations
CREATE POLICY "Authenticated users have full access"
  ON poems
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_poems_updated_at
  BEFORE UPDATE
  ON poems
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();