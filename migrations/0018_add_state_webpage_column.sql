-- Migration number: 0018 - Add webpage column to states table
-- Stores Congress.gov search URLs for each state's representatives

ALTER TABLE states ADD COLUMN webpage TEXT;