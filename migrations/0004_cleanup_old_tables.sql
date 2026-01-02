-- Migration number: 0004 - Cleanup old unused tables
-- Remove old artifacts: comments table and politicians table (replaced by representatives)

-- Drop old comments table (not used)
DROP TABLE IF EXISTS comments;

-- Drop old politicians table (replaced by representatives table)
DROP TABLE IF EXISTS politicians;

-- Note: votes and voting_records tables are kept as they may still be useful
-- for tracking voting history, even though voting_records references the old politicians table
-- You may want to migrate voting_records to reference representatives instead in the future
