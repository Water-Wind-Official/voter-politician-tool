-- Migration number: 0006 - Add citation fields to votes/stances table
-- Add fields to cite exact bill language supporting the stance

ALTER TABLE votes ADD COLUMN exact_terminology TEXT; -- Exact text from the bill
ALTER TABLE votes ADD COLUMN page_line TEXT; -- Page and line number citation (e.g., "Page 45, Line 12")
