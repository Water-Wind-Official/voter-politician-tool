-- Migration number: 0010 - Add US territories to states table
-- Add territories that have House delegates/resident commissioners

INSERT INTO states (code, name) VALUES
('AS', 'American Samoa'),
('GU', 'Guam'),
('MP', 'Northern Mariana Islands'),
('PR', 'Puerto Rico'),
('VI', 'Virgin Islands')
ON CONFLICT(code) DO NOTHING;
