-- Migration number: 0005 - Add stance fields to votes table
-- Convert votes table to support stances with party positions and vote counts

-- Add new columns for stances
ALTER TABLE votes ADD COLUMN stance TEXT; -- The stance/position on the issue
ALTER TABLE votes ADD COLUMN party_in_opposition TEXT; -- Party that opposed (e.g., 'Democrat', 'Republican')
ALTER TABLE votes ADD COLUMN party_in_favor TEXT; -- Party that favored (e.g., 'Democrat', 'Republican')
ALTER TABLE votes ADD COLUMN votes_in_favor INTEGER; -- Number of votes in favor
ALTER TABLE votes ADD COLUMN votes_opposed INTEGER; -- Number of votes opposed
ALTER TABLE votes ADD COLUMN total_votes INTEGER; -- Total votes cast

-- Note: bill_title can be used for "bill" field
-- Note: question can be used for "vote" field
-- Note: date already exists
