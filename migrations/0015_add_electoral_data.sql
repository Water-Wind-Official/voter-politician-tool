-- Migration number: 0015 - Add electoral data fields to states table
-- Electoral winner, year, and margin for most recent presidential election

ALTER TABLE states ADD COLUMN electoral_winner TEXT; -- 'Republican', 'Democrat', or NULL
ALTER TABLE states ADD COLUMN electoral_year INTEGER; -- Year of the election (e.g., 2020, 2024)
ALTER TABLE states ADD COLUMN electoral_margin REAL; -- Margin of victory as percentage (e.g., 5.2 for 5.2%)
