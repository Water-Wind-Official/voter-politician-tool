-- Migration number: 0023 - Add amount column to moneyhub table

ALTER TABLE moneyhub ADD COLUMN amount INTEGER;
