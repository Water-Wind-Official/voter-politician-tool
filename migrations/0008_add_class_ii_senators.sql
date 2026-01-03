-- Migration number: 0008 - Add Class II Senators (terms expire 2027)
-- Senators elected in November 2020, terms run from January 3, 2021 to January 3, 2027

-- Democrats
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, term_start, term_end, is_active, external_id) VALUES
('Cory A. Booker', 'Cory', 'Booker', 'NJ', 'Democrat', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-nj-booker'),
('Christopher A. Coons', 'Christopher', 'Coons', 'DE', 'Democrat', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-de-coons'),
('Richard J. Durbin', 'Richard', 'Durbin', 'IL', 'Democrat', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-il-durbin'),
('John W. Hickenlooper', 'John', 'Hickenlooper', 'CO', 'Democrat', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-co-hickenlooper'),
('Ben Ray Luján', 'Ben Ray', 'Luján', 'NM', 'Democrat', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-nm-lujan'),
('Edward J. Markey', 'Edward', 'Markey', 'MA', 'Democrat', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-ma-markey'),
('Jeff Merkley', 'Jeff', 'Merkley', 'OR', 'Democrat', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-or-merkley'),
('Jon Ossoff', 'Jon', 'Ossoff', 'GA', 'Democrat', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-ga-ossoff'),
('Gary C. Peters', 'Gary', 'Peters', 'MI', 'Democrat', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-mi-peters'),
('Jack Reed', 'Jack', 'Reed', 'RI', 'Democrat', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-ri-reed'),
('Jeanne Shaheen', 'Jeanne', 'Shaheen', 'NH', 'Democrat', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-nh-shaheen'),
('Tina Smith', 'Tina', 'Smith', 'MN', 'Democrat', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-mn-smith'),
('Mark R. Warner', 'Mark', 'Warner', 'VA', 'Democrat', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-va-warner')
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
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, term_start, term_end, is_active, external_id) VALUES
('Shelley Moore Capito', 'Shelley', 'Capito', 'WV', 'Republican', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-wv-capito'),
('Bill Cassidy', 'Bill', 'Cassidy', 'LA', 'Republican', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-la-cassidy'),
('Susan M. Collins', 'Susan', 'Collins', 'ME', 'Republican', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-me-collins'),
('John Cornyn', 'John', 'Cornyn', 'TX', 'Republican', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-tx-cornyn'),
('Tom Cotton', 'Tom', 'Cotton', 'AR', 'Republican', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-ar-cotton'),
('Steve Daines', 'Steve', 'Daines', 'MT', 'Republican', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-mt-daines'),
('Joni Ernst', 'Joni', 'Ernst', 'IA', 'Republican', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-ia-ernst'),
('Lindsey Graham', 'Lindsey', 'Graham', 'SC', 'Republican', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-sc-graham'),
('Bill Hagerty', 'Bill', 'Hagerty', 'TN', 'Republican', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-tn-hagerty'),
('Cindy Hyde-Smith', 'Cindy', 'Hyde-Smith', 'MS', 'Republican', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-ms-hyde-smith'),
('Cynthia M. Lummis', 'Cynthia', 'Lummis', 'WY', 'Republican', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-wy-lummis'),
('Roger Marshall', 'Roger', 'Marshall', 'KS', 'Republican', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-ks-marshall'),
('Mitch McConnell', 'Mitch', 'McConnell', 'KY', 'Republican', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-ky-mcconnell'),
('Markwayne Mullin', 'Markwayne', 'Mullin', 'OK', 'Republican', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-ok-mullin'),
('Pete Ricketts', 'Pete', 'Ricketts', 'NE', 'Republican', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-ne-ricketts'),
('James E. Risch', 'James', 'Risch', 'ID', 'Republican', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-id-risch'),
('Mike Rounds', 'Mike', 'Rounds', 'SD', 'Republican', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-sd-rounds'),
('Dan Sullivan', 'Dan', 'Sullivan', 'AK', 'Republican', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-ak-sullivan'),
('Thom Tillis', 'Thom', 'Tillis', 'NC', 'Republican', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-nc-tillis'),
('Tommy Tuberville', 'Tommy', 'Tuberville', 'AL', 'Republican', 'senate', 1, '2021-01-03', '2027-01-03', 1, 'senate-al-tuberville')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name,
	first_name = excluded.first_name,
	last_name = excluded.last_name,
	party = excluded.party,
	term_start = excluded.term_start,
	term_end = excluded.term_end,
	is_active = excluded.is_active,
	updated_at = CURRENT_TIMESTAMP;
