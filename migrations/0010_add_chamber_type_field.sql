-- Migration number: 0010 - Add numeric chamber_type field (0=house, 1=senate)
-- This provides a numeric field for easier querying while keeping the text chamber field

ALTER TABLE representatives ADD COLUMN chamber_type INTEGER DEFAULT 0;

-- Update existing records based on chamber field
UPDATE representatives SET chamber_type = 1 WHERE chamber = 'senate';
UPDATE representatives SET chamber_type = 0 WHERE chamber = 'house';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_representatives_chamber_type ON representatives(chamber_type);
