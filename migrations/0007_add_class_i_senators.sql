-- Migration number: 0007 - Add Class I Senators (terms expire 2031)
-- Senators elected in November 2024, terms run from January 3, 2025 to January 3, 2031

-- Democrats
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, term_start, term_end, is_active, external_id) VALUES
('Angela D. Alsobrooks', 'Angela', 'Alsobrooks', 'MD', 'Democrat', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-md-alsobrooks'),
('Tammy Baldwin', 'Tammy', 'Baldwin', 'WI', 'Democrat', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-wi-baldwin'),
('Lisa Blunt Rochester', 'Lisa', 'Blunt Rochester', 'DE', 'Democrat', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-de-blunt-rochester'),
('Maria Cantwell', 'Maria', 'Cantwell', 'WA', 'Democrat', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-wa-cantwell'),
('Ruben Gallego', 'Ruben', 'Gallego', 'AZ', 'Democrat', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-az-gallego'),
('Kirsten E. Gillibrand', 'Kirsten', 'Gillibrand', 'NY', 'Democrat', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-ny-gillibrand'),
('Martin Heinrich', 'Martin', 'Heinrich', 'NM', 'Democrat', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-nm-heinrich'),
('Mazie K. Hirono', 'Mazie', 'Hirono', 'HI', 'Democrat', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-hi-hirono'),
('Tim Kaine', 'Tim', 'Kaine', 'VA', 'Democrat', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-va-kaine'),
('Andy Kim', 'Andy', 'Kim', 'NJ', 'Democrat', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-nj-kim'),
('Amy Klobuchar', 'Amy', 'Klobuchar', 'MN', 'Democrat', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-mn-klobuchar'),
('Christopher Murphy', 'Christopher', 'Murphy', 'CT', 'Democrat', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-ct-murphy'),
('Jacky Rosen', 'Jacky', 'Rosen', 'NV', 'Democrat', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-nv-rosen'),
('Adam B. Schiff', 'Adam', 'Schiff', 'CA', 'Democrat', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-ca-schiff'),
('Elissa Slotkin', 'Elissa', 'Slotkin', 'MI', 'Democrat', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-mi-slotkin'),
('Elizabeth Warren', 'Elizabeth', 'Warren', 'MA', 'Democrat', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-ma-warren'),
('Sheldon Whitehouse', 'Sheldon', 'Whitehouse', 'RI', 'Democrat', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-ri-whitehouse')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name,
	first_name = excluded.first_name,
	last_name = excluded.last_name,
	party = excluded.party,
	term_start = excluded.term_start,
	term_end = excluded.term_end,
	is_active = excluded.is_active,
	updated_at = CURRENT_TIMESTAMP;

-- Republicans
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, term_start, term_end, is_active, external_id) VALUES
('Jim Banks', 'Jim', 'Banks', 'IN', 'Republican', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-in-banks'),
('John Barrasso', 'John', 'Barrasso', 'WY', 'Republican', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-wy-barrasso'),
('Marsha Blackburn', 'Marsha', 'Blackburn', 'TN', 'Republican', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-tn-blackburn'),
('Kevin Cramer', 'Kevin', 'Cramer', 'ND', 'Republican', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-nd-cramer'),
('Ted Cruz', 'Ted', 'Cruz', 'TX', 'Republican', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-tx-cruz'),
('John R. Curtis', 'John', 'Curtis', 'UT', 'Republican', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-ut-curtis'),
('Deb Fischer', 'Deb', 'Fischer', 'NE', 'Republican', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-ne-fischer'),
('Josh Hawley', 'Josh', 'Hawley', 'MO', 'Republican', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-mo-hawley'),
('James C. Justice', 'James', 'Justice', 'WV', 'Republican', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-wv-justice'),
('David McCormick', 'David', 'McCormick', 'PA', 'Republican', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-pa-mccormick'),
('Bernie Moreno', 'Bernie', 'Moreno', 'OH', 'Republican', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-oh-moreno'),
('Rick Scott', 'Rick', 'Scott', 'FL', 'Republican', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-fl-scott'),
('Tim Sheehy', 'Tim', 'Sheehy', 'MT', 'Republican', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-mt-sheehy'),
('Roger F. Wicker', 'Roger', 'Wicker', 'MS', 'Republican', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-ms-wicker')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name,
	first_name = excluded.first_name,
	last_name = excluded.last_name,
	party = excluded.party,
	term_start = excluded.term_start,
	term_end = excluded.term_end,
	is_active = excluded.is_active,
	updated_at = CURRENT_TIMESTAMP;

-- Independents
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, term_start, term_end, is_active, external_id) VALUES
('Angus S. King, Jr.', 'Angus', 'King', 'ME', 'Independent', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-me-king'),
('Bernard Sanders', 'Bernard', 'Sanders', 'VT', 'Independent', 'senate', '2025-01-03', '2031-01-03', 1, 'senate-vt-sanders')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name,
	first_name = excluded.first_name,
	last_name = excluded.last_name,
	party = excluded.party,
	term_start = excluded.term_start,
	term_end = excluded.term_end,
	is_active = excluded.is_active,
	updated_at = CURRENT_TIMESTAMP;
