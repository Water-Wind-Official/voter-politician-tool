-- Migration number: 0012 - Add remaining House of Representatives members
-- Continuing from 0011 with all remaining states

-- Georgia (14 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Earl Carter', 'Earl', 'Carter', 'GA', 'Republican', 'house', 0, '2432 RHOB', '(202) 225-5831', 1, 'house-ga-01-carter'),
('Sanford Bishop', 'Sanford', 'Bishop', 'GA', 'Democrat', 'house', 0, '2407 RHOB', '(202) 225-3631', 1, 'house-ga-02-bishop'),
('Brian Jack', 'Brian', 'Jack', 'GA', 'Republican', 'house', 0, '1320 LHOB', '(202) 225-5901', 1, 'house-ga-03-jack'),
('Henry Johnson', 'Henry', 'Johnson', 'GA', 'Democrat', 'house', 0, '2240 RHOB', '(202) 225-1605', 1, 'house-ga-04-johnson'),
('Nikema Williams', 'Nikema', 'Williams', 'GA', 'Democrat', 'house', 0, '1406 LHOB', '(202) 225-3801', 1, 'house-ga-05-williams'),
('Lucy McBath', 'Lucy', 'McBath', 'GA', 'Democrat', 'house', 0, '2246 RHOB', '(202) 225-4501', 1, 'house-ga-06-mcbath'),
('Richard McCormick', 'Richard', 'McCormick', 'GA', 'Republican', 'house', 0, '1719 LHOB', '(202) 225-4272', 1, 'house-ga-07-mccormick'),
('Austin Scott', 'Austin', 'Scott', 'GA', 'Republican', 'house', 0, '2185 RHOB', '(202) 225-6531', 1, 'house-ga-08-scott'),
('Andrew Clyde', 'Andrew', 'Clyde', 'GA', 'Republican', 'house', 0, '445 CHOB', '(202) 225-9893', 1, 'house-ga-09-clyde'),
('Mike Collins', 'Mike', 'Collins', 'GA', 'Republican', 'house', 0, '2351 RHOB', '(202) 225-4101', 1, 'house-ga-10-collins'),
('Barry Loudermilk', 'Barry', 'Loudermilk', 'GA', 'Republican', 'house', 0, '2133 RHOB', '(202) 225-2931', 1, 'house-ga-11-loudermilk'),
('Rick Allen', 'Rick', 'Allen', 'GA', 'Republican', 'house', 0, '462 CHOB', '(202) 225-2823', 1, 'house-ga-12-allen'),
('David Scott', 'David', 'Scott', 'GA', 'Democrat', 'house', 0, '468 CHOB', '(202) 225-2939', 1, 'house-ga-13-scott'),
('Marjorie Greene', 'Marjorie', 'Greene', 'GA', 'Republican', 'house', 0, '2201 RHOB', '(202) 225-5211', 1, 'house-ga-14-greene')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Guam (Delegate)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('James Moylan', 'James', 'Moylan', 'GU', 'Republican', 'house', 0, '228 CHOB', '(202) 225-1188', 1, 'house-gu-00-moylan')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Hawaii (2 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Ed Case', 'Ed', 'Case', 'HI', 'Democrat', 'house', 0, '2210 RHOB', '(202) 225-2726', 1, 'house-hi-01-case'),
('Jill Tokuda', 'Jill', 'Tokuda', 'HI', 'Democrat', 'house', 0, '1027 LHOB', '(202) 225-4906', 1, 'house-hi-02-tokuda')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Idaho (2 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Russ Fulcher', 'Russ', 'Fulcher', 'ID', 'Republican', 'house', 0, '1514 LHOB', '(202) 225-6611', 1, 'house-id-01-fulcher'),
('Michael Simpson', 'Michael', 'Simpson', 'ID', 'Republican', 'house', 0, '2084 RHOB', '(202) 225-5531', 1, 'house-id-02-simpson')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Illinois (17 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Jonathan Jackson', 'Jonathan', 'Jackson', 'IL', 'Democrat', 'house', 0, '1632 LHOB', '(202) 225-4372', 1, 'house-il-01-jackson'),
('Robin Kelly', 'Robin', 'Kelly', 'IL', 'Democrat', 'house', 0, '2329 RHOB', '(202) 225-0773', 1, 'house-il-02-kelly'),
('Delia Ramirez', 'Delia', 'Ramirez', 'IL', 'Democrat', 'house', 0, '1523 LHOB', '(202) 225-5701', 1, 'house-il-03-ramirez'),
('Jesus Garcia', 'Jesus', 'Garcia', 'IL', 'Democrat', 'house', 0, '2334 RHOB', '(202) 225-8203', 1, 'house-il-04-garcia'),
('Mike Quigley', 'Mike', 'Quigley', 'IL', 'Democrat', 'house', 0, '2083 RHOB', '(202) 225-4061', 1, 'house-il-05-quigley'),
('Sean Casten', 'Sean', 'Casten', 'IL', 'Democrat', 'house', 0, '2440 RHOB', '(202) 225-4561', 1, 'house-il-06-casten'),
('Danny Davis', 'Danny', 'Davis', 'IL', 'Democrat', 'house', 0, '2159 RHOB', '(202) 225-5006', 1, 'house-il-07-davis'),
('Raja Krishnamoorthi', 'Raja', 'Krishnamoorthi', 'IL', 'Democrat', 'house', 0, '2367 RHOB', '(202) 225-3711', 1, 'house-il-08-krishnamoorthi'),
('Janice Schakowsky', 'Janice', 'Schakowsky', 'IL', 'Democrat', 'house', 0, '2408 RHOB', '(202) 225-2111', 1, 'house-il-09-schakowsky'),
('Bradley Schneider', 'Bradley', 'Schneider', 'IL', 'Democrat', 'house', 0, '300 CHOB', '(202) 225-4835', 1, 'house-il-10-schneider'),
('Bill Foster', 'Bill', 'Foster', 'IL', 'Democrat', 'house', 0, '2366 RHOB', '(202) 225-3515', 1, 'house-il-11-foster'),
('Mike Bost', 'Mike', 'Bost', 'IL', 'Republican', 'house', 0, '352 CHOB', '(202) 225-5661', 1, 'house-il-12-bost'),
('Nikki Budzinski', 'Nikki', 'Budzinski', 'IL', 'Democrat', 'house', 0, '1717 LHOB', '(202) 225-2371', 1, 'house-il-13-budzinski'),
('Lauren Underwood', 'Lauren', 'Underwood', 'IL', 'Democrat', 'house', 0, '2228 RHOB', '(202) 225-2976', 1, 'house-il-14-underwood'),
('Mary Miller', 'Mary', 'Miller', 'IL', 'Republican', 'house', 0, '1740 LHOB', '(202) 225-5271', 1, 'house-il-15-miller'),
('Darin LaHood', 'Darin', 'LaHood', 'IL', 'Republican', 'house', 0, '503 CHOB', '(202) 225-6201', 1, 'house-il-16-lahood'),
('Eric Sorensen', 'Eric', 'Sorensen', 'IL', 'Democrat', 'house', 0, '1314 LHOB', '(202) 225-5905', 1, 'house-il-17-sorensen')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Indiana (9 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Frank Mrvan', 'Frank', 'Mrvan', 'IN', 'Democrat', 'house', 0, '2441 RHOB', '(202) 225-2461', 1, 'house-in-01-mrvan'),
('Rudy Yakym', 'Rudy', 'Yakym', 'IN', 'Republican', 'house', 0, '349 CHOB', '(202) 225-3915', 1, 'house-in-02-yakym'),
('Marlin Stutzman', 'Marlin', 'Stutzman', 'IN', 'Republican', 'house', 0, '404 CHOB', '(202) 225-4436', 1, 'house-in-03-stutzman'),
('James Baird', 'James', 'Baird', 'IN', 'Republican', 'house', 0, '2303 RHOB', '(202) 225-5037', 1, 'house-in-04-baird'),
('Victoria Spartz', 'Victoria', 'Spartz', 'IN', 'Republican', 'house', 0, '1609 LHOB', '(202) 225-2276', 1, 'house-in-05-spartz'),
('Jefferson Shreve', 'Jefferson', 'Shreve', 'IN', 'Republican', 'house', 0, '224 CHOB', '(202) 225-3021', 1, 'house-in-06-shreve'),
('Andre Carson', 'Andre', 'Carson', 'IN', 'Democrat', 'house', 0, '2135 RHOB', '(202) 225-4011', 1, 'house-in-07-carson'),
('Mark Messmer', 'Mark', 'Messmer', 'IN', 'Republican', 'house', 0, '1208 LHOB', '(202) 225-4636', 1, 'house-in-08-messmer'),
('Erin Houchin', 'Erin', 'Houchin', 'IN', 'Republican', 'house', 0, '342 CHOB', '(202) 225-5315', 1, 'house-in-09-houchin')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Iowa (4 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Mariannette Miller-Meeks', 'Mariannette', 'Miller-Meeks', 'IA', 'Republican', 'house', 0, '504 CHOB', '(202) 225-6576', 1, 'house-ia-01-miller-meeks'),
('Ashley Hinson', 'Ashley', 'Hinson', 'IA', 'Republican', 'house', 0, '2458 RHOB', '(202) 225-2911', 1, 'house-ia-02-hinson'),
('Zachary Nunn', 'Zachary', 'Nunn', 'IA', 'Republican', 'house', 0, '1410 LHOB', '(202) 225-5476', 1, 'house-ia-03-nunn'),
('Randy Feenstra', 'Randy', 'Feenstra', 'IA', 'Republican', 'house', 0, '2434 RHOB', '(202) 225-4426', 1, 'house-ia-04-feenstra')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Note: All remaining states (Kansas through Wyoming) will be added in migration 0013