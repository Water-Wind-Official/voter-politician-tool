-- Migration number: 0013 - Add final House of Representatives members
-- Remaining states: Kansas through Wyoming

-- Kansas (4 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Tracey Mann', 'Tracey', 'Mann', 'KS', 'Republican', 'house', 0, '344 CHOB', '(202) 225-2715', 1, 'house-ks-01-mann'),
('Derek Schmidt', 'Derek', 'Schmidt', 'KS', 'Republican', 'house', 0, '1223 LHOB', '(202) 225-6601', 1, 'house-ks-02-schmidt'),
('Sharice Davids', 'Sharice', 'Davids', 'KS', 'Democrat', 'house', 0, '2435 RHOB', '(202) 225-2865', 1, 'house-ks-03-davids'),
('Ron Estes', 'Ron', 'Estes', 'KS', 'Republican', 'house', 0, '2234 RHOB', '(202) 225-6216', 1, 'house-ks-04-estes')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Kentucky (6 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('James Comer', 'James', 'Comer', 'KY', 'Republican', 'house', 0, '2410 RHOB', '(202) 225-3115', 1, 'house-ky-01-comer'),
('Brett Guthrie', 'Brett', 'Guthrie', 'KY', 'Republican', 'house', 0, '2161 RHOB', '(202) 225-3501', 1, 'house-ky-02-guthrie'),
('Morgan McGarvey', 'Morgan', 'McGarvey', 'KY', 'Democrat', 'house', 0, '1527 LHOB', '(202) 225-5401', 1, 'house-ky-03-mcgarvey'),
('Thomas Massie', 'Thomas', 'Massie', 'KY', 'Republican', 'house', 0, '2371 RHOB', '(202) 225-3465', 1, 'house-ky-04-massie'),
('Harold Rogers', 'Harold', 'Rogers', 'KY', 'Republican', 'house', 0, '2406 RHOB', '(202) 225-4601', 1, 'house-ky-05-rogers'),
('Andy Barr', 'Andy', 'Barr', 'KY', 'Republican', 'house', 0, '2430 RHOB', '(202) 225-4706', 1, 'house-ky-06-barr')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Louisiana (6 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Steve Scalise', 'Steve', 'Scalise', 'LA', 'Republican', 'house', 0, '266 CHOB', '(202) 225-3015', 1, 'house-la-01-scalise'),
('Troy Carter', 'Troy', 'Carter', 'LA', 'Democrat', 'house', 0, '442 CHOB', '(202) 225-6636', 1, 'house-la-02-carter'),
('Clay Higgins', 'Clay', 'Higgins', 'LA', 'Republican', 'house', 0, '572 CHOB', '(202) 225-2031', 1, 'house-la-03-higgins'),
('Mike Johnson', 'Mike', 'Johnson', 'LA', 'Republican', 'house', 0, '521 CHOB', '(202) 225-2777', 1, 'house-la-04-johnson'),
('Julia Letlow', 'Julia', 'Letlow', 'LA', 'Republican', 'house', 0, '142 CHOB', '(202) 225-8490', 1, 'house-la-05-letlow'),
('Cleo Fields', 'Cleo', 'Fields', 'LA', 'Democrat', 'house', 0, '2349 RHOB', '(202) 225-3901', 1, 'house-la-06-fields')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Maine (2 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Chellie Pingree', 'Chellie', 'Pingree', 'ME', 'Democrat', 'house', 0, '2354 RHOB', '(202) 225-6116', 1, 'house-me-01-pingree'),
('Jared Golden', 'Jared', 'Golden', 'ME', 'Democrat', 'house', 0, '1107 LHOB', '(202) 225-6306', 1, 'house-me-02-golden')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Maryland (8 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Andy Harris', 'Andy', 'Harris', 'MD', 'Republican', 'house', 0, '1536 LHOB', '(202) 225-5311', 1, 'house-md-01-harris'),
('Johnny Olszewski', 'Johnny', 'Olszewski', 'MD', 'Democrat', 'house', 0, '1339 LHOB', '(202) 225-3061', 1, 'house-md-02-olszewski'),
('Sarah Elfreth', 'Sarah', 'Elfreth', 'MD', 'Democrat', 'house', 0, '1213 LHOB', '(202) 225-4016', 1, 'house-md-03-elfreth'),
('Glenn Ivey', 'Glenn', 'Ivey', 'MD', 'Democrat', 'house', 0, '1610 LHOB', '(202) 225-8699', 1, 'house-md-04-ivey'),
('Steny Hoyer', 'Steny', 'Hoyer', 'MD', 'Democrat', 'house', 0, '1705 LHOB', '(202) 225-4131', 1, 'house-md-05-hoyer'),
('April McClain Delaney', 'April', 'McClain Delaney', 'MD', 'Democrat', 'house', 0, '1130 LHOB', '(202) 225-2721', 1, 'house-md-06-mcclain-delaney'),
('Kweisi Mfume', 'Kweisi', 'Mfume', 'MD', 'Democrat', 'house', 0, '2263 RHOB', '(202) 225-4741', 1, 'house-md-07-mfume'),
('Jamie Raskin', 'Jamie', 'Raskin', 'MD', 'Democrat', 'house', 0, '2242 RHOB', '(202) 225-5341', 1, 'house-md-08-raskin')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Massachusetts (9 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Richard Neal', 'Richard', 'Neal', 'MA', 'Democrat', 'house', 0, '372 CHOB', '(202) 225-5601', 1, 'house-ma-01-neal'),
('James McGovern', 'James', 'McGovern', 'MA', 'Democrat', 'house', 0, '370 CHOB', '(202) 225-6101', 1, 'house-ma-02-mcgovern'),
('Lori Trahan', 'Lori', 'Trahan', 'MA', 'Democrat', 'house', 0, '2233 RHOB', '(202) 225-3411', 1, 'house-ma-03-trahan'),
('Jake Auchincloss', 'Jake', 'Auchincloss', 'MA', 'Democrat', 'house', 0, '1524 LHOB', '(202) 225-5931', 1, 'house-ma-04-auchincloss'),
('Katherine Clark', 'Katherine', 'Clark', 'MA', 'Democrat', 'house', 0, '2368 RHOB', '(202) 225-2836', 1, 'house-ma-05-clark'),
('Seth Moulton', 'Seth', 'Moulton', 'MA', 'Democrat', 'house', 0, '1126 LHOB', '(202) 225-8020', 1, 'house-ma-06-moulton'),
('Ayanna Pressley', 'Ayanna', 'Pressley', 'MA', 'Democrat', 'house', 0, '402 CHOB', '(202) 225-5111', 1, 'house-ma-07-pressley'),
('Stephen Lynch', 'Stephen', 'Lynch', 'MA', 'Democrat', 'house', 0, '2109 RHOB', '(202) 225-8273', 1, 'house-ma-08-lynch'),
('William Keating', 'William', 'Keating', 'MA', 'Democrat', 'house', 0, '2372 RHOB', '(202) 225-3111', 1, 'house-ma-09-keating')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Michigan (13 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Jack Bergman', 'Jack', 'Bergman', 'MI', 'Republican', 'house', 0, '566 CHOB', '(202) 225-4735', 1, 'house-mi-01-bergman'),
('John Moolenaar', 'John', 'Moolenaar', 'MI', 'Republican', 'house', 0, '246 CHOB', '(202) 225-3561', 1, 'house-mi-02-moolenaar'),
('Hillary Scholten', 'Hillary', 'Scholten', 'MI', 'Democrat', 'house', 0, '1317 LHOB', '(202) 225-3831', 1, 'house-mi-03-scholten'),
('Bill Huizenga', 'Bill', 'Huizenga', 'MI', 'Republican', 'house', 0, '2232 RHOB', '(202) 225-4401', 1, 'house-mi-04-huizenga'),
('Tim Walberg', 'Tim', 'Walberg', 'MI', 'Republican', 'house', 0, '2266 RHOB', '(202) 225-6276', 1, 'house-mi-05-walberg'),
('Debbie Dingell', 'Debbie', 'Dingell', 'MI', 'Democrat', 'house', 0, '102 CHOB', '(202) 225-4071', 1, 'house-mi-06-dingell'),
('Tom Barrett', 'Tom', 'Barrett', 'MI', 'Republican', 'house', 0, '1232 LHOB', '(202) 225-4872', 1, 'house-mi-07-barrett'),
('Kristen McDonald Rivet', 'Kristen', 'McDonald Rivet', 'MI', 'Democrat', 'house', 0, '1408 LHOB', '(202) 225-3611', 1, 'house-mi-08-mcdonald-rivet'),
('Lisa McClain', 'Lisa', 'McClain', 'MI', 'Republican', 'house', 0, '562 CHOB', '(202) 225-2106', 1, 'house-mi-09-mcclain'),
('John James', 'John', 'James', 'MI', 'Republican', 'house', 0, '1519 LHOB', '(202) 225-4961', 1, 'house-mi-10-james'),
('Haley Stevens', 'Haley', 'Stevens', 'MI', 'Democrat', 'house', 0, '2411 RHOB', '(202) 225-8171', 1, 'house-mi-11-stevens'),
('Rashida Tlaib', 'Rashida', 'Tlaib', 'MI', 'Democrat', 'house', 0, '2438 RHOB', '(202) 225-5126', 1, 'house-mi-12-tlaib'),
('Shri Thanedar', 'Shri', 'Thanedar', 'MI', 'Democrat', 'house', 0, '154 CHOB', '(202) 225-5802', 1, 'house-mi-13-thanedar')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Minnesota (8 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Brad Finstad', 'Brad', 'Finstad', 'MN', 'Republican', 'house', 0, '2418 RHOB', '(202) 225-2472', 1, 'house-mn-01-finstad'),
('Angie Craig', 'Angie', 'Craig', 'MN', 'Democrat', 'house', 0, '2052 RHOB', '(202) 225-2271', 1, 'house-mn-02-craig'),
('Kelly Morrison', 'Kelly', 'Morrison', 'MN', 'Democrat', 'house', 0, '1205 LHOB', '(202) 225-2871', 1, 'house-mn-03-morrison'),
('Betty McCollum', 'Betty', 'McCollum', 'MN', 'Democrat', 'house', 0, '2426 RHOB', '(202) 225-6631', 1, 'house-mn-04-mccollum'),
('Ilhan Omar', 'Ilhan', 'Omar', 'MN', 'Democrat', 'house', 0, '1730 LHOB', '(202) 225-4755', 1, 'house-mn-05-omar'),
('Tom Emmer', 'Tom', 'Emmer', 'MN', 'Republican', 'house', 0, '326 CHOB', '(202) 225-2331', 1, 'house-mn-06-emmer'),
('Michelle Fischbach', 'Michelle', 'Fischbach', 'MN', 'Republican', 'house', 0, '2229 RHOB', '(202) 225-2165', 1, 'house-mn-07-fischbach'),
('Pete Stauber', 'Pete', 'Stauber', 'MN', 'Republican', 'house', 0, '145 CHOB', '(202) 225-6211', 1, 'house-mn-08-stauber')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Mississippi (4 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Trent Kelly', 'Trent', 'Kelly', 'MS', 'Republican', 'house', 0, '2243 RHOB', '(202) 225-4306', 1, 'house-ms-01-kelly'),
('Bennie Thompson', 'Bennie', 'Thompson', 'MS', 'Democrat', 'house', 0, '2466 RHOB', '(202) 225-5876', 1, 'house-ms-02-thompson'),
('Michael Guest', 'Michael', 'Guest', 'MS', 'Republican', 'house', 0, '450 CHOB', '(202) 225-5031', 1, 'house-ms-03-guest'),
('Mike Ezell', 'Mike', 'Ezell', 'MS', 'Republican', 'house', 0, '443 CHOB', '(202) 225-5772', 1, 'house-ms-04-ezell')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Missouri (8 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Wesley Bell', 'Wesley', 'Bell', 'MO', 'Democrat', 'house', 0, '1429 LHOB', '(202) 225-2406', 1, 'house-mo-01-bell'),
('Ann Wagner', 'Ann', 'Wagner', 'MO', 'Republican', 'house', 0, '2350 RHOB', '(202) 225-1621', 1, 'house-mo-02-wagner'),
('Robert Onder', 'Robert', 'Onder', 'MO', 'Republican', 'house', 0, '1113 LHOB', '(202) 225-2956', 1, 'house-mo-03-onder'),
('Mark Alford', 'Mark', 'Alford', 'MO', 'Republican', 'house', 0, '328 CHOB', '(202) 225-2876', 1, 'house-mo-04-alford'),
('Emanuel Cleaver', 'Emanuel', 'Cleaver', 'MO', 'Democrat', 'house', 0, '2217 RHOB', '(202) 225-4535', 1, 'house-mo-05-cleaver'),
('Sam Graves', 'Sam', 'Graves', 'MO', 'Republican', 'house', 0, '1135 LHOB', '(202) 225-7041', 1, 'house-mo-06-graves'),
('Eric Burlison', 'Eric', 'Burlison', 'MO', 'Republican', 'house', 0, '1108 LHOB', '(202) 225-6536', 1, 'house-mo-07-burlison'),
('Jason Smith', 'Jason', 'Smith', 'MO', 'Republican', 'house', 0, '1011 LHOB', '(202) 225-4404', 1, 'house-mo-08-smith')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Montana (2 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Ryan Zinke', 'Ryan', 'Zinke', 'MT', 'Republican', 'house', 0, '512 CHOB', '(202) 225-5628', 1, 'house-mt-01-zinke'),
('Troy Downing', 'Troy', 'Downing', 'MT', 'Republican', 'house', 0, '1529 LHOB', '(202) 225-3211', 1, 'house-mt-02-downing')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Nebraska (3 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Mike Flood', 'Mike', 'Flood', 'NE', 'Republican', 'house', 0, '343 CHOB', '(202) 225-4806', 1, 'house-ne-01-flood'),
('Don Bacon', 'Don', 'Bacon', 'NE', 'Republican', 'house', 0, '2104 RHOB', '(202) 225-4155', 1, 'house-ne-02-bacon'),
('Adrian Smith', 'Adrian', 'Smith', 'NE', 'Republican', 'house', 0, '502 CHOB', '(202) 225-6435', 1, 'house-ne-03-smith')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Nevada (4 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Dina Titus', 'Dina', 'Titus', 'NV', 'Democrat', 'house', 0, '2370 RHOB', '(202) 225-5965', 1, 'house-nv-01-titus'),
('Mark Amodei', 'Mark', 'Amodei', 'NV', 'Republican', 'house', 0, '104 CHOB', '(202) 225-6155', 1, 'house-nv-02-amodei'),
('Susie Lee', 'Susie', 'Lee', 'NV', 'Democrat', 'house', 0, '365 CHOB', '(202) 225-3252', 1, 'house-nv-03-lee'),
('Steven Horsford', 'Steven', 'Horsford', 'NV', 'Democrat', 'house', 0, '406 CHOB', '(202) 225-9894', 1, 'house-nv-04-horsford')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- New Hampshire (2 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Chris Pappas', 'Chris', 'Pappas', 'NH', 'Democrat', 'house', 0, '452 CHOB', '(202) 225-5456', 1, 'house-nh-01-pappas'),
('Maggie Goodlander', 'Maggie', 'Goodlander', 'NH', 'Democrat', 'house', 0, '223 CHOB', '(202) 225-5206', 1, 'house-nh-02-goodlander')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- New Jersey (12 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Donald Norcross', 'Donald', 'Norcross', 'NJ', 'Democrat', 'house', 0, '2427 RHOB', '(202) 225-6501', 1, 'house-nj-01-norcross'),
('Jefferson Van Drew', 'Jefferson', 'Van Drew', 'NJ', 'Republican', 'house', 0, '2447 RHOB', '(202) 225-6572', 1, 'house-nj-02-van-drew'),
('Herbert Conaway', 'Herbert', 'Conaway', 'NJ', 'Democrat', 'house', 0, '1022 LHOB', '(202) 225-4765', 1, 'house-nj-03-conaway'),
('Christopher Smith', 'Christopher', 'Smith', 'NJ', 'Republican', 'house', 0, '2373 RHOB', '(202) 225-3765', 1, 'house-nj-04-smith'),
('Josh Gottheimer', 'Josh', 'Gottheimer', 'NJ', 'Democrat', 'house', 0, '106 CHOB', '(202) 225-4465', 1, 'house-nj-05-gottheimer'),
('Frank Pallone', 'Frank', 'Pallone', 'NJ', 'Democrat', 'house', 0, '2107 RHOB', '(202) 225-4671', 1, 'house-nj-06-pallone'),
('Thomas Kean', 'Thomas', 'Kean', 'NJ', 'Republican', 'house', 0, '251 CHOB', '(202) 225-5361', 1, 'house-nj-07-kean'),
('Robert Menendez', 'Robert', 'Menendez', 'NJ', 'Democrat', 'house', 0, '2453 RHOB', '(202) 225-7919', 1, 'house-nj-08-menendez'),
('Nellie Pou', 'Nellie', 'Pou', 'NJ', 'Democrat', 'house', 0, '1007 LHOB', '(202) 225-5751', 1, 'house-nj-09-pou'),
('LaMonica McIver', 'LaMonica', 'McIver', 'NJ', 'Democrat', 'house', 0, '426 CHOB', '(202) 225-3436', 1, 'house-nj-10-mciver'),
('Mikie Sherrill', 'Mikie', 'Sherrill', 'NJ', 'Democrat', 'house', 0, '1427 LHOB', '(202) 225-5034', 1, 'house-nj-11-sherrill'),
('Bonnie Watson Coleman', 'Bonnie', 'Watson Coleman', 'NJ', 'Democrat', 'house', 0, '168 CHOB', '(202) 225-5801', 1, 'house-nj-12-watson-coleman')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- New Mexico (3 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Melanie Stansbury', 'Melanie', 'Stansbury', 'NM', 'Democrat', 'house', 0, '1421 LHOB', '(202) 225-6316', 1, 'house-nm-01-stansbury'),
('Gabe Vasquez', 'Gabe', 'Vasquez', 'NM', 'Democrat', 'house', 0, '322 CHOB', '(202) 225-2365', 1, 'house-nm-02-vasquez'),
('Teresa Leger Fernandez', 'Teresa', 'Leger Fernandez', 'NM', 'Democrat', 'house', 0, '2417 RHOB', '(202) 225-6190', 1, 'house-nm-03-leger-fernandez')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- New York (26 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Nick LaLota', 'Nick', 'LaLota', 'NY', 'Republican', 'house', 0, '122 CHOB', '(202) 225-3826', 1, 'house-ny-01-lalota'),
('Andrew Garbarino', 'Andrew', 'Garbarino', 'NY', 'Republican', 'house', 0, '2344 RHOB', '(202) 225-7896', 1, 'house-ny-02-garbarino'),
('Thomas R. Suozzi', 'Thomas', 'Suozzi', 'NY', 'Democrat', 'house', 0, '203 CHOB', '(202) 225-3335', 1, 'house-ny-03-suozzi'),
('Laura Gillen', 'Laura', 'Gillen', 'NY', 'Democrat', 'house', 0, '428 CHOB', '(202) 225-5516', 1, 'house-ny-04-gillen'),
('Gregory Meeks', 'Gregory', 'Meeks', 'NY', 'Democrat', 'house', 0, '2310 RHOB', '(202) 225-3461', 1, 'house-ny-05-meeks'),
('Grace Meng', 'Grace', 'Meng', 'NY', 'Democrat', 'house', 0, '2468 RHOB', '(202) 225-2601', 1, 'house-ny-06-meng'),
('Nydia Velazquez', 'Nydia', 'Velazquez', 'NY', 'Democrat', 'house', 0, '2302 RHOB', '(202) 225-2361', 1, 'house-ny-07-velazquez'),
('Hakeem Jeffries', 'Hakeem', 'Jeffries', 'NY', 'Democrat', 'house', 0, '2267 RHOB', '(202) 225-5936', 1, 'house-ny-08-jeffries'),
('Yvette Clarke', 'Yvette', 'Clarke', 'NY', 'Democrat', 'house', 0, '2058 RHOB', '(202) 225-6231', 1, 'house-ny-09-clarke'),
('Daniel Goldman', 'Daniel', 'Goldman', 'NY', 'Democrat', 'house', 0, '245 CHOB', '(202) 225-7944', 1, 'house-ny-10-goldman'),
('Nicole Malliotakis', 'Nicole', 'Malliotakis', 'NY', 'Republican', 'house', 0, '1124 LHOB', '(202) 225-3371', 1, 'house-ny-11-malliotakis'),
('Jerrold Nadler', 'Jerrold', 'Nadler', 'NY', 'Democrat', 'house', 0, '2132 RHOB', '(202) 225-5635', 1, 'house-ny-12-nadler'),
('Adriano Espaillat', 'Adriano', 'Espaillat', 'NY', 'Democrat', 'house', 0, '2332 RHOB', '(202) 225-4365', 1, 'house-ny-13-espaillat'),
('Alexandria Ocasio-Cortez', 'Alexandria', 'Ocasio-Cortez', 'NY', 'Democrat', 'house', 0, '250 CHOB', '(202) 225-3965', 1, 'house-ny-14-ocasio-cortez'),
('Ritchie Torres', 'Ritchie', 'Torres', 'NY', 'Democrat', 'house', 0, '1414 LHOB', '(202) 225-4361', 1, 'house-ny-15-torres'),
('George Latimer', 'George', 'Latimer', 'NY', 'Democrat', 'house', 0, '1507 LHOB', '(202) 225-2464', 1, 'house-ny-16-latimer'),
('Michael Lawler', 'Michael', 'Lawler', 'NY', 'Republican', 'house', 0, '324 CHOB', '(202) 225-6506', 1, 'house-ny-17-lawler'),
('Patrick Ryan', 'Patrick', 'Ryan', 'NY', 'Democrat', 'house', 0, '1708 LHOB', '(202) 225-5614', 1, 'house-ny-18-ryan'),
('Josh Riley', 'Josh', 'Riley', 'NY', 'Democrat', 'house', 0, '128 CHOB', '(202) 225-5441', 1, 'house-ny-19-riley'),
('Paul Tonko', 'Paul', 'Tonko', 'NY', 'Democrat', 'house', 0, '2269 RHOB', '(202) 225-5076', 1, 'house-ny-20-tonko'),
('Elise Stefanik', 'Elise', 'Stefanik', 'NY', 'Republican', 'house', 0, '2211 RHOB', '(202) 225-4611', 1, 'house-ny-21-stefanik'),
('John Mannion', 'John', 'Mannion', 'NY', 'Democrat', 'house', 0, '1516 LHOB', '(202) 225-3701', 1, 'house-ny-22-mannion'),
('Nicholas Langworthy', 'Nicholas', 'Langworthy', 'NY', 'Republican', 'house', 0, '422 CHOB', '(202) 225-3161', 1, 'house-ny-23-langworthy'),
('Claudia Tenney', 'Claudia', 'Tenney', 'NY', 'Republican', 'house', 0, '2230 RHOB', '(202) 225-3665', 1, 'house-ny-24-tenney'),
('Joseph Morelle', 'Joseph', 'Morelle', 'NY', 'Democrat', 'house', 0, '570 CHOB', '(202) 225-3615', 1, 'house-ny-25-morelle'),
('Timothy Kennedy', 'Timothy', 'Kennedy', 'NY', 'Democrat', 'house', 0, '423 CHOB', '(202) 225-3306', 1, 'house-ny-26-kennedy')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Note: Continuing with remaining states (North Carolina through Wyoming) in next migration