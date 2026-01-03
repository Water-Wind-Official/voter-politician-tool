-- Migration number: 0022 - Replace single link column with 6 link columns
-- Changes from single link to multiple reference links (link1-link6)

-- Drop the old single link column
ALTER TABLE issues DROP COLUMN link;

-- Add 6 link columns for multiple references
ALTER TABLE issues ADD COLUMN link1 TEXT;
ALTER TABLE issues ADD COLUMN link2 TEXT;
ALTER TABLE issues ADD COLUMN link3 TEXT;
ALTER TABLE issues ADD COLUMN link4 TEXT;
ALTER TABLE issues ADD COLUMN link5 TEXT;
ALTER TABLE issues ADD COLUMN link6 TEXT;