-- Migration number: 0014 - Complete all remaining House members
-- Final states: North Carolina through Wyoming

-- North Carolina (14 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Donald Davis', 'Donald', 'Davis', 'NC', 'Democrat', 'house', 0, '1123 LHOB', '(202) 225-3101', 1, 'house-nc-01-davis'),
('Deborah Ross', 'Deborah', 'Ross', 'NC', 'Democrat', 'house', 0, '1221 LHOB', '(202) 225-3032', 1, 'house-nc-02-ross'),
('Gregory Murphy', 'Gregory', 'Murphy', 'NC', 'Republican', 'house', 0, '407 CHOB', '(202) 225-3415', 1, 'house-nc-03-murphy'),
('Valerie Foushee', 'Valerie', 'Foushee', 'NC', 'Democrat', 'house', 0, '2452 RHOB', '(202) 225-1784', 1, 'house-nc-04-foushee'),
('Virginia Foxx', 'Virginia', 'Foxx', 'NC', 'Republican', 'house', 0, '2462 RHOB', '(202) 225-2071', 1, 'house-nc-05-foxx'),
('Addison McDowell', 'Addison', 'McDowell', 'NC', 'Republican', 'house', 0, '1032 LHOB', '(202) 225-3065', 1, 'house-nc-06-mcdowell'),
('David Rouzer', 'David', 'Rouzer', 'NC', 'Republican', 'house', 0, '2333 RHOB', '(202) 225-2731', 1, 'house-nc-07-rouzer'),
('Mark Harris', 'Mark', 'Harris', 'NC', 'Republican', 'house', 0, '126 CHOB', '(202) 225-1976', 1, 'house-nc-08-harris'),
('Richard Hudson', 'Richard', 'Hudson', 'NC', 'Republican', 'house', 0, '2112 RHOB', '(202) 225-3715', 1, 'house-nc-09-hudson'),
('Pat Harrigan', 'Pat', 'Harrigan', 'NC', 'Republican', 'house', 0, '1233 LHOB', '(202) 225-2576', 1, 'house-nc-10-harrigan'),
('Chuck Edwards', 'Chuck', 'Edwards', 'NC', 'Republican', 'house', 0, '1505 LHOB', '(202) 225-6401', 1, 'house-nc-11-edwards'),
('Alma Adams', 'Alma', 'Adams', 'NC', 'Democrat', 'house', 0, '2436 RHOB', '(202) 225-1510', 1, 'house-nc-12-adams'),
('Brad Knott', 'Brad', 'Knott', 'NC', 'Republican', 'house', 0, '1239 LHOB', '(202) 225-4531', 1, 'house-nc-13-knott'),
('Tim Moore', 'Tim', 'Moore', 'NC', 'Republican', 'house', 0, '1424 LHOB', '(202) 225-5634', 1, 'house-nc-14-moore')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- North Dakota (At Large)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Julie Fedorchak', 'Julie', 'Fedorchak', 'ND', 'Republican', 'house', 0, '1607 LHOB', '(202) 225-2611', 1, 'house-nd-00-fedorchak')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Northern Mariana Islands (Delegate)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Kimberlyn King-Hinds', 'Kimberlyn', 'King-Hinds', 'MP', 'Republican', 'house', 0, '425 CHOB', '(202) 225-2646', 1, 'house-mp-00-king-hinds')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Ohio (15 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Greg Landsman', 'Greg', 'Landsman', 'OH', 'Democrat', 'house', 0, '2244 RHOB', '(202) 225-2216', 1, 'house-oh-01-landsman'),
('David Taylor', 'David', 'Taylor', 'OH', 'Republican', 'house', 0, '325 CHOB', '(202) 225-3164', 1, 'house-oh-02-taylor'),
('Joyce Beatty', 'Joyce', 'Beatty', 'OH', 'Democrat', 'house', 0, '2079 RHOB', '(202) 225-4324', 1, 'house-oh-03-beatty'),
('Jim Jordan', 'Jim', 'Jordan', 'OH', 'Republican', 'house', 0, '2056 RHOB', '(202) 225-2676', 1, 'house-oh-04-jordan'),
('Robert Latta', 'Robert', 'Latta', 'OH', 'Republican', 'house', 0, '2470 RHOB', '(202) 225-6405', 1, 'house-oh-05-latta'),
('Michael A. Rulli', 'Michael', 'Rulli', 'OH', 'Republican', 'house', 0, '421 CHOB', '(202) 225-5705', 1, 'house-oh-06-rulli'),
('Max Miller', 'Max', 'Miller', 'OH', 'Republican', 'house', 0, '143 CHOB', '(202) 225-3876', 1, 'house-oh-07-miller'),
('Warren Davidson', 'Warren', 'Davidson', 'OH', 'Republican', 'house', 0, '2113 RHOB', '(202) 225-6205', 1, 'house-oh-08-davidson'),
('Marcy Kaptur', 'Marcy', 'Kaptur', 'OH', 'Democrat', 'house', 0, '2314 RHOB', '(202) 225-4146', 1, 'house-oh-09-kaptur'),
('Michael Turner', 'Michael', 'Turner', 'OH', 'Republican', 'house', 0, '2183 RHOB', '(202) 225-6465', 1, 'house-oh-10-turner'),
('Shontel Brown', 'Shontel', 'Brown', 'OH', 'Democrat', 'house', 0, '2455 RHOB', '(202) 225-7032', 1, 'house-oh-11-brown'),
('Troy Balderson', 'Troy', 'Balderson', 'OH', 'Republican', 'house', 0, '2429 RHOB', '(202) 225-5355', 1, 'house-oh-12-balderson'),
('Emilia Sykes', 'Emilia', 'Sykes', 'OH', 'Democrat', 'house', 0, '1217 LHOB', '(202) 225-6265', 1, 'house-oh-13-sykes'),
('David Joyce', 'David', 'Joyce', 'OH', 'Republican', 'house', 0, '2065 RHOB', '(202) 225-5731', 1, 'house-oh-14-joyce'),
('Mike Carey', 'Mike', 'Carey', 'OH', 'Republican', 'house', 0, '1433 LHOB', '(202) 225-2015', 1, 'house-oh-15-carey')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Oklahoma (5 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Kevin Hern', 'Kevin', 'Hern', 'OK', 'Republican', 'house', 0, '171 CHOB', '(202) 225-2211', 1, 'house-ok-01-hern'),
('Josh Brecheen', 'Josh', 'Brecheen', 'OK', 'Republican', 'house', 0, '351 CHOB', '(202) 225-2701', 1, 'house-ok-02-brecheen'),
('Frank Lucas', 'Frank', 'Lucas', 'OK', 'Republican', 'house', 0, '2405 RHOB', '(202) 225-5565', 1, 'house-ok-03-lucas'),
('Tom Cole', 'Tom', 'Cole', 'OK', 'Republican', 'house', 0, '2207 RHOB', '(202) 225-6165', 1, 'house-ok-04-cole'),
('Stephanie Bice', 'Stephanie', 'Bice', 'OK', 'Republican', 'house', 0, '2402 RHOB', '(202) 225-2132', 1, 'house-ok-05-bice')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Oregon (6 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Suzanne Bonamici', 'Suzanne', 'Bonamici', 'OR', 'Democrat', 'house', 0, '2231 RHOB', '(202) 225-0855', 1, 'house-or-01-bonamici'),
('Cliff Bentz', 'Cliff', 'Bentz', 'OR', 'Republican', 'house', 0, '409 CHOB', '(202) 225-6730', 1, 'house-or-02-bentz'),
('Maxine Dexter', 'Maxine', 'Dexter', 'OR', 'Democrat', 'house', 0, '1207 LHOB', '(202) 225-4811', 1, 'house-or-03-dexter'),
('Val Hoyle', 'Val', 'Hoyle', 'OR', 'Democrat', 'house', 0, '1620 LHOB', '(202) 225-6416', 1, 'house-or-04-hoyle'),
('Janelle Bynum', 'Janelle', 'Bynum', 'OR', 'Democrat', 'house', 0, '1508 LHOB', '(202) 225-5711', 1, 'house-or-05-bynum'),
('Andrea Salinas', 'Andrea', 'Salinas', 'OR', 'Democrat', 'house', 0, '403 CHOB', '(202) 225-5643', 1, 'house-or-06-salinas')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Pennsylvania (17 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Brian Fitzpatrick', 'Brian', 'Fitzpatrick', 'PA', 'Republican', 'house', 0, '271 CHOB', '(202) 225-4276', 1, 'house-pa-01-fitzpatrick'),
('Brendan Boyle', 'Brendan', 'Boyle', 'PA', 'Democrat', 'house', 0, '1502 LHOB', '(202) 225-6111', 1, 'house-pa-02-boyle'),
('Dwight Evans', 'Dwight', 'Evans', 'PA', 'Democrat', 'house', 0, '1105 LHOB', '(202) 225-4001', 1, 'house-pa-03-evans'),
('Madeleine Dean', 'Madeleine', 'Dean', 'PA', 'Democrat', 'house', 0, '150 CHOB', '(202) 225-4731', 1, 'house-pa-04-dean'),
('Mary Gay Scanlon', 'Mary Gay', 'Scanlon', 'PA', 'Democrat', 'house', 0, '1214 LHOB', '(202) 225-2011', 1, 'house-pa-05-scanlon'),
('Chrissy Houlahan', 'Chrissy', 'Houlahan', 'PA', 'Democrat', 'house', 0, '1727 LHOB', '(202) 225-4315', 1, 'house-pa-06-houlahan'),
('Ryan Mackenzie', 'Ryan', 'Mackenzie', 'PA', 'Republican', 'house', 0, '121 CHOB', '(202) 225-6411', 1, 'house-pa-07-mackenzie'),
('Robert Bresnahan', 'Robert', 'Bresnahan', 'PA', 'Republican', 'house', 0, '1133 LHOB', '(202) 225-5546', 1, 'house-pa-08-bresnahan'),
('Daniel Meuser', 'Daniel', 'Meuser', 'PA', 'Republican', 'house', 0, '350 CHOB', '(202) 225-6511', 1, 'house-pa-09-meuser'),
('Scott Perry', 'Scott', 'Perry', 'PA', 'Republican', 'house', 0, '2160 RHOB', '(202) 225-5836', 1, 'house-pa-10-perry'),
('Lloyd Smucker', 'Lloyd', 'Smucker', 'PA', 'Republican', 'house', 0, '302 CHOB', '(202) 225-2411', 1, 'house-pa-11-smucker'),
('Summer Lee', 'Summer', 'Lee', 'PA', 'Democrat', 'house', 0, '2437 RHOB', '(202) 225-2135', 1, 'house-pa-12-lee'),
('John Joyce', 'John', 'Joyce', 'PA', 'Republican', 'house', 0, '2102 RHOB', '(202) 225-2431', 1, 'house-pa-13-joyce'),
('Guy Reschenthaler', 'Guy', 'Reschenthaler', 'PA', 'Republican', 'house', 0, '2209 RHOB', '(202) 225-2065', 1, 'house-pa-14-reschenthaler'),
('Glenn Thompson', 'Glenn', 'Thompson', 'PA', 'Republican', 'house', 0, '400 CHOB', '(202) 225-5121', 1, 'house-pa-15-thompson'),
('Mike Kelly', 'Mike', 'Kelly', 'PA', 'Republican', 'house', 0, '1707 LHOB', '(202) 225-5406', 1, 'house-pa-16-kelly'),
('Christopher Deluzio', 'Christopher', 'Deluzio', 'PA', 'Democrat', 'house', 0, '1222 LHOB', '(202) 225-2301', 1, 'house-pa-17-deluzio')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Puerto Rico (Resident Commissioner)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Pablo Hernandez', 'Pablo', 'Hernandez', 'PR', 'Democrat', 'house', 0, '1419 LHOB', '(202) 225-2615', 1, 'house-pr-00-hernandez')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Rhode Island (2 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Gabe Amo', 'Gabe', 'Amo', 'RI', 'Democrat', 'house', 0, '1119 LHOB', '(202) 225-4911', 1, 'house-ri-01-amo'),
('Seth Magaziner', 'Seth', 'Magaziner', 'RI', 'Democrat', 'house', 0, '252 CHOB', '(202) 225-2735', 1, 'house-ri-02-magaziner')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- South Carolina (7 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Nancy Mace', 'Nancy', 'Mace', 'SC', 'Republican', 'house', 0, '1728 LHOB', '(202) 225-3176', 1, 'house-sc-01-mace'),
('Joe Wilson', 'Joe', 'Wilson', 'SC', 'Republican', 'house', 0, '1436 LHOB', '(202) 225-2452', 1, 'house-sc-02-wilson'),
('Sheri Biggs', 'Sheri', 'Biggs', 'SC', 'Republican', 'house', 0, '1530 LHOB', '(202) 225-5301', 1, 'house-sc-03-biggs'),
('William Timmons', 'William', 'Timmons', 'SC', 'Republican', 'house', 0, '267 CHOB', '(202) 225-6030', 1, 'house-sc-04-timmons'),
('Ralph Norman', 'Ralph', 'Norman', 'SC', 'Republican', 'house', 0, '569 CHOB', '(202) 225-5501', 1, 'house-sc-05-norman'),
('James Clyburn', 'James', 'Clyburn', 'SC', 'Democrat', 'house', 0, '274 CHOB', '(202) 225-3315', 1, 'house-sc-06-clyburn'),
('Russell Fry', 'Russell', 'Fry', 'SC', 'Republican', 'house', 0, '345 CHOB', '(202) 225-9895', 1, 'house-sc-07-fry')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- South Dakota (At Large)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Dusty Johnson', 'Dusty', 'Johnson', 'SD', 'Republican', 'house', 0, '1714 LHOB', '(202) 225-2801', 1, 'house-sd-00-johnson')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Tennessee (9 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Diana Harshbarger', 'Diana', 'Harshbarger', 'TN', 'Republican', 'house', 0, '167 CHOB', '(202) 225-6356', 1, 'house-tn-01-harshbarger'),
('Tim Burchett', 'Tim', 'Burchett', 'TN', 'Republican', 'house', 0, '1122 LHOB', '(202) 225-5435', 1, 'house-tn-02-burchett'),
('Charles Fleischmann', 'Charles', 'Fleischmann', 'TN', 'Republican', 'house', 0, '2187 RHOB', '(202) 225-3271', 1, 'house-tn-03-fleischmann'),
('Scott DesJarlais', 'Scott', 'DesJarlais', 'TN', 'Republican', 'house', 0, '2304 RHOB', '(202) 225-6831', 1, 'house-tn-04-desjarlais'),
('Andrew Ogles', 'Andrew', 'Ogles', 'TN', 'Republican', 'house', 0, '151 CHOB', '(202) 225-4311', 1, 'house-tn-05-ogles'),
('John Rose', 'John', 'Rose', 'TN', 'Republican', 'house', 0, '2238 RHOB', '(202) 225-4231', 1, 'house-tn-06-rose'),
('Matt Van Epps', 'Matt', 'Van Epps', 'TN', 'Republican', 'house', 0, '2446 RHOB', '(202) 225-2811', 1, 'house-tn-07-van-epps'),
('David Kustoff', 'David', 'Kustoff', 'TN', 'Republican', 'house', 0, '560 CHOB', '(202) 225-4714', 1, 'house-tn-08-kustoff'),
('Steve Cohen', 'Steve', 'Cohen', 'TN', 'Democrat', 'house', 0, '2268 RHOB', '(202) 225-3265', 1, 'house-tn-09-cohen')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Texas (38 districts - adding all)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Nathaniel Moran', 'Nathaniel', 'Moran', 'TX', 'Republican', 'house', 0, '1605 LHOB', '(202) 225-3035', 1, 'house-tx-01-moran'),
('Dan Crenshaw', 'Dan', 'Crenshaw', 'TX', 'Republican', 'house', 0, '248 CHOB', '(202) 225-6565', 1, 'house-tx-02-crenshaw'),
('Keith Self', 'Keith', 'Self', 'TX', 'Republican', 'house', 0, '1030 LHOB', '(202) 225-4201', 1, 'house-tx-03-self'),
('Pat Fallon', 'Pat', 'Fallon', 'TX', 'Republican', 'house', 0, '2416 RHOB', '(202) 225-6673', 1, 'house-tx-04-fallon'),
('Lance Gooden', 'Lance', 'Gooden', 'TX', 'Republican', 'house', 0, '2431 RHOB', '(202) 225-3484', 1, 'house-tx-05-gooden'),
('Jake Ellzey', 'Jake', 'Ellzey', 'TX', 'Republican', 'house', 0, '1721 LHOB', '(202) 225-2002', 1, 'house-tx-06-ellzey'),
('Lizzie Fletcher', 'Lizzie', 'Fletcher', 'TX', 'Democrat', 'house', 0, '2004 RHOB', '(202) 225-2571', 1, 'house-tx-07-fletcher'),
('Morgan Luttrell', 'Morgan', 'Luttrell', 'TX', 'Republican', 'house', 0, '444 CHOB', '(202) 225-4901', 1, 'house-tx-08-luttrell'),
('Al Green', 'Al', 'Green', 'TX', 'Democrat', 'house', 0, '2347 RHOB', '(202) 225-7508', 1, 'house-tx-09-green'),
('Michael McCaul', 'Michael', 'McCaul', 'TX', 'Republican', 'house', 0, '2300 RHOB', '(202) 225-2401', 1, 'house-tx-10-mccaul'),
('August Pfluger', 'August', 'Pfluger', 'TX', 'Republican', 'house', 0, '2202 RHOB', '(202) 225-3605', 1, 'house-tx-11-pfluger'),
('Craig Goldman', 'Craig', 'Goldman', 'TX', 'Republican', 'house', 0, '1716 LHOB', '(202) 225-5071', 1, 'house-tx-12-goldman'),
('Ronny Jackson', 'Ronny', 'Jackson', 'TX', 'Republican', 'house', 0, '125 CHOB', '(202) 225-3706', 1, 'house-tx-13-jackson'),
('Randy Weber', 'Randy', 'Weber', 'TX', 'Republican', 'house', 0, '107 CHOB', '(202) 225-2831', 1, 'house-tx-14-weber'),
('Monica De La Cruz', 'Monica', 'De La Cruz', 'TX', 'Republican', 'house', 0, '1415 LHOB', '(202) 225-9901', 1, 'house-tx-15-de-la-cruz'),
('Veronica Escobar', 'Veronica', 'Escobar', 'TX', 'Democrat', 'house', 0, '2448 RHOB', '(202) 225-4831', 1, 'house-tx-16-escobar'),
('Pete Sessions', 'Pete', 'Sessions', 'TX', 'Republican', 'house', 0, '2204 RHOB', '(202) 225-6105', 1, 'house-tx-17-sessions'),
('Sylvester Turner', 'Sylvester', 'Turner', 'TX', 'Democrat', 'house', 0, '1318 LHOB', '(202) 225-3816', 1, 'house-tx-18-turner'),
('Jodey Arrington', 'Jodey', 'Arrington', 'TX', 'Republican', 'house', 0, '1111 LHOB', '(202) 225-4005', 1, 'house-tx-19-arrington'),
('Joaquin Castro', 'Joaquin', 'Castro', 'TX', 'Democrat', 'house', 0, '2241 RHOB', '(202) 225-3236', 1, 'house-tx-20-castro'),
('Chip Roy', 'Chip', 'Roy', 'TX', 'Republican', 'house', 0, '103 CHOB', '(202) 225-4236', 1, 'house-tx-21-roy'),
('Troy Nehls', 'Troy', 'Nehls', 'TX', 'Republican', 'house', 0, '1104 LHOB', '(202) 225-5951', 1, 'house-tx-22-nehls'),
('Tony Gonzales', 'Tony', 'Gonzales', 'TX', 'Republican', 'house', 0, '2239 RHOB', '(202) 225-4511', 1, 'house-tx-23-gonzales'),
('Beth Van Duyne', 'Beth', 'Van Duyne', 'TX', 'Republican', 'house', 0, '1725 LHOB', '(202) 225-6605', 1, 'house-tx-24-van-duyne'),
('Roger Williams', 'Roger', 'Williams', 'TX', 'Republican', 'house', 0, '2336 RHOB', '(202) 225-9896', 1, 'house-tx-25-williams'),
('Brandon Gill', 'Brandon', 'Gill', 'TX', 'Republican', 'house', 0, '1305 LHOB', '(202) 225-7772', 1, 'house-tx-26-gill'),
('Michael Cloud', 'Michael', 'Cloud', 'TX', 'Republican', 'house', 0, '304 CHOB', '(202) 225-7742', 1, 'house-tx-27-cloud'),
('Henry Cuellar', 'Henry', 'Cuellar', 'TX', 'Democrat', 'house', 0, '2308 RHOB', '(202) 225-1640', 1, 'house-tx-28-cuellar'),
('Sylvia Garcia', 'Sylvia', 'Garcia', 'TX', 'Democrat', 'house', 0, '2419 RHOB', '(202) 225-1688', 1, 'house-tx-29-garcia'),
('Jasmine Crockett', 'Jasmine', 'Crockett', 'TX', 'Democrat', 'house', 0, '1616 LHOB', '(202) 225-8885', 1, 'house-tx-30-crockett'),
('John Carter', 'John', 'Carter', 'TX', 'Republican', 'house', 0, '2208 RHOB', '(202) 225-3864', 1, 'house-tx-31-carter'),
('Julie Johnson', 'Julie', 'Johnson', 'TX', 'Democrat', 'house', 0, '221 CHOB', '(202) 225-2231', 1, 'house-tx-32-johnson'),
('Marc Veasey', 'Marc', 'Veasey', 'TX', 'Democrat', 'house', 0, '2186 RHOB', '(202) 225-9897', 1, 'house-tx-33-veasey'),
('Vicente Gonzalez', 'Vicente', 'Gonzalez', 'TX', 'Democrat', 'house', 0, '1201 LHOB', '(202) 225-2531', 1, 'house-tx-34-gonzalez'),
('Greg Casar', 'Greg', 'Casar', 'TX', 'Democrat', 'house', 0, '446 CHOB', '(202) 225-5645', 1, 'house-tx-35-casar'),
('Brian Babin', 'Brian', 'Babin', 'TX', 'Republican', 'house', 0, '2236 RHOB', '(202) 225-1555', 1, 'house-tx-36-babin'),
('Lloyd Doggett', 'Lloyd', 'Doggett', 'TX', 'Democrat', 'house', 0, '2307 RHOB', '(202) 225-4865', 1, 'house-tx-37-doggett'),
('Wesley Hunt', 'Wesley', 'Hunt', 'TX', 'Republican', 'house', 0, '1520 LHOB', '(202) 225-5646', 1, 'house-tx-38-hunt')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Utah (4 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Blake Moore', 'Blake', 'Moore', 'UT', 'Republican', 'house', 0, '1131 LHOB', '(202) 225-0453', 1, 'house-ut-01-moore'),
('Celeste Maloy', 'Celeste', 'Maloy', 'UT', 'Republican', 'house', 0, '249 CHOB', '(202) 225-9730', 1, 'house-ut-02-maloy'),
('Mike Kennedy', 'Mike', 'Kennedy', 'UT', 'Republican', 'house', 0, '1626 LHOB', '(202) 225-7751', 1, 'house-ut-03-kennedy'),
('Burgess Owens', 'Burgess', 'Owens', 'UT', 'Republican', 'house', 0, '309 CHOB', '(202) 225-3011', 1, 'house-ut-04-owens')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Vermont (At Large)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Becca Balint', 'Becca', 'Balint', 'VT', 'Democrat', 'house', 0, '1510 LHOB', '(202) 225-4115', 1, 'house-vt-00-balint')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Virginia (11 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Robert Wittman', 'Robert', 'Wittman', 'VA', 'Republican', 'house', 0, '2055 RHOB', '(202) 225-4261', 1, 'house-va-01-wittman'),
('Jennifer Kiggans', 'Jennifer', 'Kiggans', 'VA', 'Republican', 'house', 0, '152 CHOB', '(202) 225-4215', 1, 'house-va-02-kiggans'),
('Robert Scott', 'Robert', 'Scott', 'VA', 'Democrat', 'house', 0, '2328 RHOB', '(202) 225-8351', 1, 'house-va-03-scott'),
('Jennifer McClellan', 'Jennifer', 'McClellan', 'VA', 'Democrat', 'house', 0, '1628 LHOB', '(202) 225-6365', 1, 'house-va-04-mcclellan'),
('John McGuire', 'John', 'McGuire', 'VA', 'Republican', 'house', 0, '1013 LHOB', '(202) 225-4711', 1, 'house-va-05-mcguire'),
('Ben Cline', 'Ben', 'Cline', 'VA', 'Republican', 'house', 0, '2443 RHOB', '(202) 225-5431', 1, 'house-va-06-cline'),
('Eugene Vindman', 'Eugene', 'Vindman', 'VA', 'Democrat', 'house', 0, '1005 LHOB', '(202) 225-2815', 1, 'house-va-07-vindman'),
('Donald Beyer', 'Donald', 'Beyer', 'VA', 'Democrat', 'house', 0, '1226 LHOB', '(202) 225-4376', 1, 'house-va-08-beyer'),
('H. Griffith', 'H.', 'Griffith', 'VA', 'Republican', 'house', 0, '2110 RHOB', '(202) 225-3861', 1, 'house-va-09-griffith'),
('Suhas Subramanyam', 'Suhas', 'Subramanyam', 'VA', 'Democrat', 'house', 0, '1009 LHOB', '(202) 225-5136', 1, 'house-va-10-subramanyam'),
('James Walkinshaw', 'James', 'Walkinshaw', 'VA', 'Democrat', 'house', 0, '2265 RHOB', '(202) 225-1492', 1, 'house-va-11-walkinshaw')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Virgin Islands (Delegate)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Stacey Plaskett', 'Stacey', 'Plaskett', 'VI', 'Democrat', 'house', 0, '2059 RHOB', '(202) 225-1790', 1, 'house-vi-00-plaskett')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Washington (10 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Suzan DelBene', 'Suzan', 'DelBene', 'WA', 'Democrat', 'house', 0, '2311 RHOB', '(202) 225-6311', 1, 'house-wa-01-delbene'),
('Rick Larsen', 'Rick', 'Larsen', 'WA', 'Democrat', 'house', 0, '2163 RHOB', '(202) 225-2605', 1, 'house-wa-02-larsen'),
('Marie Perez', 'Marie', 'Perez', 'WA', 'Democrat', 'house', 0, '1431 LHOB', '(202) 225-3536', 1, 'house-wa-03-perez'),
('Dan Newhouse', 'Dan', 'Newhouse', 'WA', 'Republican', 'house', 0, '460 CHOB', '(202) 225-5816', 1, 'house-wa-04-newhouse'),
('Michael Baumgartner', 'Michael', 'Baumgartner', 'WA', 'Republican', 'house', 0, '124 CHOB', '(202) 225-2006', 1, 'house-wa-05-baumgartner'),
('Emily Randall', 'Emily', 'Randall', 'WA', 'Democrat', 'house', 0, '1531 LHOB', '(202) 225-5916', 1, 'house-wa-06-randall'),
('Pramila Jayapal', 'Pramila', 'Jayapal', 'WA', 'Democrat', 'house', 0, '2346 RHOB', '(202) 225-3106', 1, 'house-wa-07-jayapal'),
('Kim Schrier', 'Kim', 'Schrier', 'WA', 'Democrat', 'house', 0, '1110 LHOB', '(202) 225-7761', 1, 'house-wa-08-schrier'),
('Adam Smith', 'Adam', 'Smith', 'WA', 'Democrat', 'house', 0, '2264 RHOB', '(202) 225-8901', 1, 'house-wa-09-smith'),
('Marilyn Strickland', 'Marilyn', 'Strickland', 'WA', 'Democrat', 'house', 0, '1724 LHOB', '(202) 225-9740', 1, 'house-wa-10-strickland')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- West Virginia (2 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Carol Miller', 'Carol', 'Miller', 'WV', 'Republican', 'house', 0, '465 CHOB', '(202) 225-3452', 1, 'house-wv-01-miller'),
('Riley Moore', 'Riley', 'Moore', 'WV', 'Republican', 'house', 0, '1337 LHOB', '(202) 225-2711', 1, 'house-wv-02-moore')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Wisconsin (8 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Bryan Steil', 'Bryan', 'Steil', 'WI', 'Republican', 'house', 0, '1526 LHOB', '(202) 225-3031', 1, 'house-wi-01-steil'),
('Mark Pocan', 'Mark', 'Pocan', 'WI', 'Democrat', 'house', 0, '1026 LHOB', '(202) 225-2906', 1, 'house-wi-02-pocan'),
('Derrick Van Orden', 'Derrick', 'Van Orden', 'WI', 'Republican', 'house', 0, '1513 LHOB', '(202) 225-5506', 1, 'house-wi-03-van-orden'),
('Gwen Moore', 'Gwen', 'Moore', 'WI', 'Democrat', 'house', 0, '2252 RHOB', '(202) 225-4572', 1, 'house-wi-04-moore'),
('Scott Fitzgerald', 'Scott', 'Fitzgerald', 'WI', 'Republican', 'house', 0, '2444 RHOB', '(202) 225-5101', 1, 'house-wi-05-fitzgerald'),
('Glenn Grothman', 'Glenn', 'Grothman', 'WI', 'Republican', 'house', 0, '1211 LHOB', '(202) 225-2476', 1, 'house-wi-06-grothman'),
('Thomas Tiffany', 'Thomas', 'Tiffany', 'WI', 'Republican', 'house', 0, '451 CHOB', '(202) 225-3365', 1, 'house-wi-07-tiffany'),
('Tony Wied', 'Tony', 'Wied', 'WI', 'Republican', 'house', 0, '424 CHOB', '(202) 225-5665', 1, 'house-wi-08-wied')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Wyoming (At Large)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Harriet Hageman', 'Harriet', 'Hageman', 'WY', 'Republican', 'house', 0, '1227 LHOB', '(202) 225-2311', 1, 'house-wy-00-hageman')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;
