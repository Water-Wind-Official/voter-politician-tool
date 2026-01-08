-- Migration number: 0024 - Add funding_type column to moneyhub table

ALTER TABLE moneyhub ADD COLUMN funding_type TEXT CHECK (funding_type IN ('Inside', 'Outside'));
