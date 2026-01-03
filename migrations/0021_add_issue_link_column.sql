-- Migration number: 0021 - Add link column to issues table
-- Stores URLs that users can click on issues to visit

ALTER TABLE issues ADD COLUMN link TEXT;