-- Migration number: 0016 - Add electoral votes field to states table

ALTER TABLE states ADD COLUMN electoral_votes INTEGER; -- Number of electoral votes allocated to each state