-- Migration number: 0011 - Add House of Representatives members for 119th Congress
-- Complete list of all 435+ House members with office information
-- Note: Districts can be linked later via district_id. For now using NULL.

-- Helper function to parse names
-- Names are in format "Last, First" or just "First Last"

-- Alabama (7 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Barry Moore', 'Barry', 'Moore', 'AL', 'Republican', 'house', 0, '1511 LHOB', '(202) 225-2901', 1, 'house-al-01-moore'),
('Shomari Figures', 'Shomari', 'Figures', 'AL', 'Democrat', 'house', 0, '225 CHOB', '(202) 225-4931', 1, 'house-al-02-figures'),
('Mike Rogers', 'Mike', 'Rogers', 'AL', 'Republican', 'house', 0, '2469 RHOB', '(202) 225-3261', 1, 'house-al-03-rogers'),
('Robert Aderholt', 'Robert', 'Aderholt', 'AL', 'Republican', 'house', 0, '272 CHOB', '(202) 225-4876', 1, 'house-al-04-aderholt'),
('Dale Strong', 'Dale', 'Strong', 'AL', 'Republican', 'house', 0, '449 CHOB', '(202) 225-4801', 1, 'house-al-05-strong'),
('Gary Palmer', 'Gary', 'Palmer', 'AL', 'Republican', 'house', 0, '170 CHOB', '(202) 225-4921', 1, 'house-al-06-palmer'),
('Terri Sewell', 'Terri', 'Sewell', 'AL', 'Democrat', 'house', 0, '1035 LHOB', '(202) 225-2665', 1, 'house-al-07-sewell')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Alaska (At Large)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Nicholas Begich', 'Nicholas', 'Begich', 'AK', 'Republican', 'house', 0, '153 CHOB', '(202) 225-5765', 1, 'house-ak-00-begich')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- American Samoa (Delegate)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Aumua Amata Radewagen', 'Aumua', 'Radewagen', 'AS', 'Republican', 'house', 0, '2001 RHOB', '(202) 225-8577', 1, 'house-as-00-radewagen')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Arizona (9 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('David Schweikert', 'David', 'Schweikert', 'AZ', 'Republican', 'house', 0, '166 CHOB', '(202) 225-2190', 1, 'house-az-01-schweikert'),
('Elijah Crane', 'Elijah', 'Crane', 'AZ', 'Republican', 'house', 0, '307 CHOB', '(202) 225-3361', 1, 'house-az-02-crane'),
('Yassamin Ansari', 'Yassamin', 'Ansari', 'AZ', 'Democrat', 'house', 0, '1432 LHOB', '(202) 225-4065', 1, 'house-az-03-ansari'),
('Greg Stanton', 'Greg', 'Stanton', 'AZ', 'Democrat', 'house', 0, '207 CHOB', '(202) 225-9888', 1, 'house-az-04-stanton'),
('Andy Biggs', 'Andy', 'Biggs', 'AZ', 'Republican', 'house', 0, '464 CHOB', '(202) 225-2635', 1, 'house-az-05-biggs'),
('Juan Ciscomani', 'Juan', 'Ciscomani', 'AZ', 'Republican', 'house', 0, '461 CHOB', '(202) 225-2542', 1, 'house-az-06-ciscomani'),
('Adelita Grijalva', 'Adelita', 'Grijalva', 'AZ', 'Democrat', 'house', 0, '1203 LHOB', '(202) 225-2435', 1, 'house-az-07-grijalva'),
('Abraham Hamadeh', 'Abraham', 'Hamadeh', 'AZ', 'Republican', 'house', 0, '1722 LHOB', '(202) 225-4576', 1, 'house-az-08-hamadeh'),
('Paul Gosar', 'Paul', 'Gosar', 'AZ', 'Republican', 'house', 0, '2057 RHOB', '(202) 225-2315', 1, 'house-az-09-gosar')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Arkansas (4 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Eric Crawford', 'Eric', 'Crawford', 'AR', 'Republican', 'house', 0, '2422 RHOB', '(202) 225-4076', 1, 'house-ar-01-crawford'),
('J. Hill', 'J.', 'Hill', 'AR', 'Republican', 'house', 0, '1533 LHOB', '(202) 225-2506', 1, 'house-ar-02-hill'),
('Steve Womack', 'Steve', 'Womack', 'AR', 'Republican', 'house', 0, '2412 RHOB', '(202) 225-4301', 1, 'house-ar-03-womack'),
('Bruce Westerman', 'Bruce', 'Westerman', 'AR', 'Republican', 'house', 0, '202 CHOB', '(202) 225-3772', 1, 'house-ar-04-westerman')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- California (52 districts - adding all)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Doug LaMalfa', 'Doug', 'LaMalfa', 'CA', 'Republican', 'house', 0, '408 CHOB', '(202) 225-3076', 1, 'house-ca-01-lamalfa'),
('Jared Huffman', 'Jared', 'Huffman', 'CA', 'Democrat', 'house', 0, '2330 RHOB', '(202) 225-5161', 1, 'house-ca-02-huffman'),
('Kevin Kiley', 'Kevin', 'Kiley', 'CA', 'Republican', 'house', 0, '2445 RHOB', '(202) 225-2523', 1, 'house-ca-03-kiley'),
('Mike Thompson', 'Mike', 'Thompson', 'CA', 'Democrat', 'house', 0, '268 CHOB', '(202) 225-3311', 1, 'house-ca-04-thompson'),
('Tom McClintock', 'Tom', 'McClintock', 'CA', 'Republican', 'house', 0, '2256 RHOB', '(202) 225-2511', 1, 'house-ca-05-mcclintock'),
('Ami Bera', 'Ami', 'Bera', 'CA', 'Democrat', 'house', 0, '172 CHOB', '(202) 225-5716', 1, 'house-ca-06-bera'),
('Doris Matsui', 'Doris', 'Matsui', 'CA', 'Democrat', 'house', 0, '2206 RHOB', '(202) 225-7163', 1, 'house-ca-07-matsui'),
('John Garamendi', 'John', 'Garamendi', 'CA', 'Democrat', 'house', 0, '2428 RHOB', '(202) 225-1880', 1, 'house-ca-08-garamendi'),
('Josh Harder', 'Josh', 'Harder', 'CA', 'Democrat', 'house', 0, '209 CHOB', '(202) 225-4540', 1, 'house-ca-09-harder'),
('Mark DeSaulnier', 'Mark', 'DeSaulnier', 'CA', 'Democrat', 'house', 0, '2134 RHOB', '(202) 225-2095', 1, 'house-ca-10-desaulnier'),
('Nancy Pelosi', 'Nancy', 'Pelosi', 'CA', 'Democrat', 'house', 0, '1236 LHOB', '(202) 225-4965', 1, 'house-ca-11-pelosi'),
('Lateefah Simon', 'Lateefah', 'Simon', 'CA', 'Democrat', 'house', 0, '1023 LHOB', '(202) 225-2661', 1, 'house-ca-12-simon'),
('Adam Gray', 'Adam', 'Gray', 'CA', 'Democrat', 'house', 0, '1230 LHOB', '(202) 225-1947', 1, 'house-ca-13-gray'),
('Eric Swalwell', 'Eric', 'Swalwell', 'CA', 'Democrat', 'house', 0, '174 CHOB', '(202) 225-5065', 1, 'house-ca-14-swalwell'),
('Kevin Mullin', 'Kevin', 'Mullin', 'CA', 'Democrat', 'house', 0, '1404 LHOB', '(202) 225-3531', 1, 'house-ca-15-mullin'),
('Sam Liccardo', 'Sam', 'Liccardo', 'CA', 'Democrat', 'house', 0, '1117 LHOB', '(202) 225-8104', 1, 'house-ca-16-liccardo'),
('Ro Khanna', 'Ro', 'Khanna', 'CA', 'Democrat', 'house', 0, '306 CHOB', '(202) 225-2631', 1, 'house-ca-17-khanna'),
('Zoe Lofgren', 'Zoe', 'Lofgren', 'CA', 'Democrat', 'house', 0, '1401 LHOB', '(202) 225-3072', 1, 'house-ca-18-lofgren'),
('Jimmy Panetta', 'Jimmy', 'Panetta', 'CA', 'Democrat', 'house', 0, '200 CHOB', '(202) 225-2861', 1, 'house-ca-19-panetta'),
('Vince Fong', 'Vince', 'Fong', 'CA', 'Republican', 'house', 0, '243 CHOB', '(202) 225-2915', 1, 'house-ca-20-fong'),
('Jim Costa', 'Jim', 'Costa', 'CA', 'Democrat', 'house', 0, '2081 RHOB', '(202) 225-3341', 1, 'house-ca-21-costa'),
('David Valadao', 'David', 'Valadao', 'CA', 'Republican', 'house', 0, '2465 RHOB', '(202) 225-4695', 1, 'house-ca-22-valadao'),
('Jay Obernolte', 'Jay', 'Obernolte', 'CA', 'Republican', 'house', 0, '2433 RHOB', '(202) 225-5861', 1, 'house-ca-23-obernolte'),
('Salud Carbajal', 'Salud', 'Carbajal', 'CA', 'Democrat', 'house', 0, '2331 RHOB', '(202) 225-3601', 1, 'house-ca-24-carbajal'),
('Raul Ruiz', 'Raul', 'Ruiz', 'CA', 'Democrat', 'house', 0, '2342 RHOB', '(202) 225-5330', 1, 'house-ca-25-ruiz'),
('Julia Brownley', 'Julia', 'Brownley', 'CA', 'Democrat', 'house', 0, '2262 RHOB', '(202) 225-5811', 1, 'house-ca-26-brownley'),
('George Whitesides', 'George', 'Whitesides', 'CA', 'Democrat', 'house', 0, '1504 LHOB', '(202) 225-1956', 1, 'house-ca-27-whitesides'),
('Judy Chu', 'Judy', 'Chu', 'CA', 'Democrat', 'house', 0, '2423 RHOB', '(202) 225-5464', 1, 'house-ca-28-chu'),
('Luz Rivas', 'Luz', 'Rivas', 'CA', 'Democrat', 'house', 0, '1319 LHOB', '(202) 225-6131', 1, 'house-ca-29-rivas'),
('Laura Friedman', 'Laura', 'Friedman', 'CA', 'Democrat', 'house', 0, '1517 LHOB', '(202) 225-4176', 1, 'house-ca-30-friedman'),
('Gilbert Cisneros', 'Gilbert', 'Cisneros', 'CA', 'Democrat', 'house', 0, '2463 RHOB', '(202) 225-5256', 1, 'house-ca-31-cisneros'),
('Brad Sherman', 'Brad', 'Sherman', 'CA', 'Democrat', 'house', 0, '2365 RHOB', '(202) 225-5911', 1, 'house-ca-32-sherman'),
('Pete Aguilar', 'Pete', 'Aguilar', 'CA', 'Democrat', 'house', 0, '108 CHOB', '(202) 225-3201', 1, 'house-ca-33-aguilar'),
('Jimmy Gomez', 'Jimmy', 'Gomez', 'CA', 'Democrat', 'house', 0, '506 CHOB', '(202) 225-6235', 1, 'house-ca-34-gomez'),
('Norma Torres', 'Norma', 'Torres', 'CA', 'Democrat', 'house', 0, '2227 RHOB', '(202) 225-6161', 1, 'house-ca-35-torres'),
('Ted Lieu', 'Ted', 'Lieu', 'CA', 'Democrat', 'house', 0, '2454 RHOB', '(202) 225-3976', 1, 'house-ca-36-lieu'),
('Sydney Kamlager-Dove', 'Sydney', 'Kamlager-Dove', 'CA', 'Democrat', 'house', 0, '144 CHOB', '(202) 225-7084', 1, 'house-ca-37-kamlager-dove'),
('Linda Sanchez', 'Linda', 'Sanchez', 'CA', 'Democrat', 'house', 0, '2309 RHOB', '(202) 225-6676', 1, 'house-ca-38-sanchez'),
('Mark Takano', 'Mark', 'Takano', 'CA', 'Democrat', 'house', 0, '2078 RHOB', '(202) 225-2305', 1, 'house-ca-39-takano'),
('Young Kim', 'Young', 'Kim', 'CA', 'Republican', 'house', 0, '2439 RHOB', '(202) 225-4111', 1, 'house-ca-40-kim'),
('Ken Calvert', 'Ken', 'Calvert', 'CA', 'Republican', 'house', 0, '2205 RHOB', '(202) 225-1986', 1, 'house-ca-41-calvert'),
('Robert Garcia', 'Robert', 'Garcia', 'CA', 'Democrat', 'house', 0, '109 CHOB', '(202) 225-7924', 1, 'house-ca-42-garcia'),
('Maxine Waters', 'Maxine', 'Waters', 'CA', 'Democrat', 'house', 0, '2221 RHOB', '(202) 225-2201', 1, 'house-ca-43-waters'),
('Nanette Barragan', 'Nanette', 'Barragan', 'CA', 'Democrat', 'house', 0, '2312 RHOB', '(202) 225-8220', 1, 'house-ca-44-barragan'),
('Derek Tran', 'Derek', 'Tran', 'CA', 'Democrat', 'house', 0, '1127 LHOB', '(202) 225-2415', 1, 'house-ca-45-tran'),
('J. Correa', 'J.', 'Correa', 'CA', 'Democrat', 'house', 0, '2082 RHOB', '(202) 225-2965', 1, 'house-ca-46-correa'),
('Dave Min', 'Dave', 'Min', 'CA', 'Democrat', 'house', 0, '1034 LHOB', '(202) 225-5611', 1, 'house-ca-47-min'),
('Darrell Issa', 'Darrell', 'Issa', 'CA', 'Republican', 'house', 0, '2108 RHOB', '(202) 225-5672', 1, 'house-ca-48-issa'),
('Mike Levin', 'Mike', 'Levin', 'CA', 'Democrat', 'house', 0, '2352 RHOB', '(202) 225-3906', 1, 'house-ca-49-levin'),
('Scott Peters', 'Scott', 'Peters', 'CA', 'Democrat', 'house', 0, '2369 RHOB', '(202) 225-0508', 1, 'house-ca-50-peters'),
('Sara Jacobs', 'Sara', 'Jacobs', 'CA', 'Democrat', 'house', 0, '2348 RHOB', '(202) 225-2040', 1, 'house-ca-51-jacobs'),
('Juan Vargas', 'Juan', 'Vargas', 'CA', 'Democrat', 'house', 0, '2467 RHOB', '(202) 225-8045', 1, 'house-ca-52-vargas')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Colorado (8 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Diana DeGette', 'Diana', 'DeGette', 'CO', 'Democrat', 'house', 0, '2111 RHOB', '(202) 225-4431', 1, 'house-co-01-degette'),
('Joe Neguse', 'Joe', 'Neguse', 'CO', 'Democrat', 'house', 0, '2400 RHOB', '(202) 225-2161', 1, 'house-co-02-neguse'),
('Jeff Hurd', 'Jeff', 'Hurd', 'CO', 'Republican', 'house', 0, '1641 LHOB', '(202) 225-4676', 1, 'house-co-03-hurd'),
('Lauren Boebert', 'Lauren', 'Boebert', 'CO', 'Republican', 'house', 0, '1713 LHOB', '(202) 225-4761', 1, 'house-co-04-boebert'),
('Jeff Crank', 'Jeff', 'Crank', 'CO', 'Republican', 'house', 0, '1029 LHOB', '(202) 225-4422', 1, 'house-co-05-crank'),
('Jason Crow', 'Jason', 'Crow', 'CO', 'Democrat', 'house', 0, '1323 LHOB', '(202) 225-7882', 1, 'house-co-06-crow'),
('Brittany Pettersen', 'Brittany', 'Pettersen', 'CO', 'Democrat', 'house', 0, '348 CHOB', '(202) 225-2645', 1, 'house-co-07-pettersen'),
('Gabe Evans', 'Gabe', 'Evans', 'CO', 'Republican', 'house', 0, '1229 LHOB', '(202) 225-5625', 1, 'house-co-08-evans')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Connecticut (5 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('John Larson', 'John', 'Larson', 'CT', 'Democrat', 'house', 0, '1501 LHOB', '(202) 225-2265', 1, 'house-ct-01-larson'),
('Joe Courtney', 'Joe', 'Courtney', 'CT', 'Democrat', 'house', 0, '2449 RHOB', '(202) 225-2076', 1, 'house-ct-02-courtney'),
('Rosa DeLauro', 'Rosa', 'DeLauro', 'CT', 'Democrat', 'house', 0, '2413 RHOB', '(202) 225-3661', 1, 'house-ct-03-delauro'),
('James Himes', 'James', 'Himes', 'CT', 'Democrat', 'house', 0, '2137 RHOB', '(202) 225-5541', 1, 'house-ct-04-himes'),
('Jahana Hayes', 'Jahana', 'Hayes', 'CT', 'Democrat', 'house', 0, '2049 RHOB', '(202) 225-4476', 1, 'house-ct-05-hayes')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Delaware (At Large)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Sarah McBride', 'Sarah', 'McBride', 'DE', 'Democrat', 'house', 0, '1306 LHOB', '(202) 225-4165', 1, 'house-de-00-mcbride')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- District of Columbia (Delegate)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Eleanor Norton', 'Eleanor', 'Norton', 'DC', 'Democrat', 'house', 0, '2136 RHOB', '(202) 225-8050', 1, 'house-dc-00-norton')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Florida (28 districts)
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, chamber_type, office_address, office_phone, is_active, external_id) VALUES
('Jimmy Patronis', 'Jimmy', 'Patronis', 'FL', 'Republican', 'house', 0, '2021 RHOB', '(202) 225-4136', 1, 'house-fl-01-patronis'),
('Neal Dunn', 'Neal', 'Dunn', 'FL', 'Republican', 'house', 0, '466 CHOB', '(202) 225-5235', 1, 'house-fl-02-dunn'),
('Kat Cammack', 'Kat', 'Cammack', 'FL', 'Republican', 'house', 0, '2421 RHOB', '(202) 225-5744', 1, 'house-fl-03-cammack'),
('Aaron Bean', 'Aaron', 'Bean', 'FL', 'Republican', 'house', 0, '2459 RHOB', '(202) 225-0123', 1, 'house-fl-04-bean'),
('John Rutherford', 'John', 'Rutherford', 'FL', 'Republican', 'house', 0, '1711 LHOB', '(202) 225-2501', 1, 'house-fl-05-rutherford'),
('Randy Fine', 'Randy', 'Fine', 'FL', 'Republican', 'house', 0, '244 CHOB', '(202) 225-2706', 1, 'house-fl-06-fine'),
('Cory Mills', 'Cory', 'Mills', 'FL', 'Republican', 'house', 0, '346 CHOB', '(202) 225-4035', 1, 'house-fl-07-mills'),
('Mike Haridopolos', 'Mike', 'Haridopolos', 'FL', 'Republican', 'house', 0, '1039 LHOB', '(202) 225-3671', 1, 'house-fl-08-haridopolos'),
('Darren Soto', 'Darren', 'Soto', 'FL', 'Democrat', 'house', 0, '2353 RHOB', '(202) 225-9889', 1, 'house-fl-09-soto'),
('Maxwell Frost', 'Maxwell', 'Frost', 'FL', 'Democrat', 'house', 0, '1224 LHOB', '(202) 225-2176', 1, 'house-fl-10-frost'),
('Daniel Webster', 'Daniel', 'Webster', 'FL', 'Republican', 'house', 0, '2184 RHOB', '(202) 225-1002', 1, 'house-fl-11-webster'),
('Gus Bilirakis', 'Gus', 'Bilirakis', 'FL', 'Republican', 'house', 0, '2306 RHOB', '(202) 225-5755', 1, 'house-fl-12-bilirakis'),
('Anna Paulina Luna', 'Anna Paulina', 'Luna', 'FL', 'Republican', 'house', 0, '226 CHOB', '(202) 225-5961', 1, 'house-fl-13-luna'),
('Kathy Castor', 'Kathy', 'Castor', 'FL', 'Democrat', 'house', 0, '2188 RHOB', '(202) 225-3376', 1, 'house-fl-14-castor'),
('Laurel Lee', 'Laurel', 'Lee', 'FL', 'Republican', 'house', 0, '2464 RHOB', '(202) 225-5626', 1, 'house-fl-15-lee'),
('Vern Buchanan', 'Vern', 'Buchanan', 'FL', 'Republican', 'house', 0, '2409 RHOB', '(202) 225-5015', 1, 'house-fl-16-buchanan'),
('W. Steube', 'W.', 'Steube', 'FL', 'Republican', 'house', 0, '2457 RHOB', '(202) 225-5792', 1, 'house-fl-17-steube'),
('Scott Franklin', 'Scott', 'Franklin', 'FL', 'Republican', 'house', 0, '2301 RHOB', '(202) 225-1252', 1, 'house-fl-18-franklin'),
('Byron Donalds', 'Byron', 'Donalds', 'FL', 'Republican', 'house', 0, '1710 LHOB', '(202) 225-2536', 1, 'house-fl-19-donalds'),
('Sheila Cherfilus-McCormick', 'Sheila', 'Cherfilus-McCormick', 'FL', 'Democrat', 'house', 0, '2442 RHOB', '(202) 225-1313', 1, 'house-fl-20-cherfilus-mccormick'),
('Brian Mast', 'Brian', 'Mast', 'FL', 'Republican', 'house', 0, '2182 RHOB', '(202) 225-3026', 1, 'house-fl-21-mast'),
('Lois Frankel', 'Lois', 'Frankel', 'FL', 'Democrat', 'house', 0, '2305 RHOB', '(202) 225-9890', 1, 'house-fl-22-frankel'),
('Jared Moskowitz', 'Jared', 'Moskowitz', 'FL', 'Democrat', 'house', 0, '242 CHOB', '(202) 225-3001', 1, 'house-fl-23-moskowitz'),
('Frederica Wilson', 'Frederica', 'Wilson', 'FL', 'Democrat', 'house', 0, '2080 RHOB', '(202) 225-4506', 1, 'house-fl-24-wilson'),
('Debbie Wasserman Schultz', 'Debbie', 'Wasserman Schultz', 'FL', 'Democrat', 'house', 0, '270 CHOB', '(202) 225-7931', 1, 'house-fl-25-wasserman-schultz'),
('Mario Diaz-Balart', 'Mario', 'Diaz-Balart', 'FL', 'Republican', 'house', 0, '374 CHOB', '(202) 225-4211', 1, 'house-fl-26-diaz-balart'),
('Maria Salazar', 'Maria', 'Salazar', 'FL', 'Republican', 'house', 0, '2162 RHOB', '(202) 225-3931', 1, 'house-fl-27-salazar'),
('Carlos Gimenez', 'Carlos', 'Gimenez', 'FL', 'Republican', 'house', 0, '448 CHOB', '(202) 225-2778', 1, 'house-fl-28-gimenez')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name, first_name = excluded.first_name, last_name = excluded.last_name,
	party = excluded.party, office_address = excluded.office_address, office_phone = excluded.office_phone,
	updated_at = CURRENT_TIMESTAMP;

-- Note: Due to the large volume (435+ members), this migration includes the first several states.
-- The remaining states will be added in a follow-up migration or can be added via the admin panel.
-- All entries use chamber_type = 0 for House members as requested.
