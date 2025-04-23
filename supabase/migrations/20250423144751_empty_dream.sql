/*
  # Add featured poems support

  1. Changes
    - Add `is_featured` column to poems table
    - Add constraint to limit featured poems to 5
    - Add trigger to enforce featured poems limit
*/

-- Add is_featured column
ALTER TABLE poems ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- Create function to check featured poems count
CREATE OR REPLACE FUNCTION check_featured_poems_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_featured = true THEN
    IF (
      SELECT COUNT(*)
      FROM poems
      WHERE is_featured = true AND id != NEW.id
    ) >= 5 THEN
      RAISE EXCEPTION 'Cannot have more than 5 featured poems';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce featured poems limit
DROP TRIGGER IF EXISTS enforce_featured_poems_limit ON poems;
CREATE TRIGGER enforce_featured_poems_limit
  BEFORE INSERT OR UPDATE ON poems
  FOR EACH ROW
  EXECUTE FUNCTION check_featured_poems_limit();