-- Migration number: 0009 - Add Class III Senators (terms expire 2029)
-- Senators elected in November 2022, terms run from January 3, 2023 to January 3, 2029

-- Democrats
INSERT INTO representatives (name, first_name, last_name, state_code, party, chamber, term_start, term_end, is_active, external_id) VALUES
('Michael F. Bennet', 'Michael', 'Bennet', 'CO', 'Democrat', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-co-bennet'),
('Richard Blumenthal', 'Richard', 'Blumenthal', 'CT', 'Democrat', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-ct-blumenthal'),
('Catherine Cortez Masto', 'Catherine', 'Cortez Masto', 'NV', 'Democrat', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-nv-cortez-masto'),
('Tammy Duckworth', 'Tammy', 'Duckworth', 'IL', 'Democrat', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-il-duckworth'),
('John Fetterman', 'John', 'Fetterman', 'PA', 'Democrat', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-pa-fetterman'),
('Margaret Wood Hassan', 'Margaret', 'Hassan', 'NH', 'Democrat', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-nh-hassan'),
('Mark Kelly', 'Mark', 'Kelly', 'AZ', 'Democrat', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-az-kelly'),
('Patty Murray', 'Patty', 'Murray', 'WA', 'Democrat', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-wa-murray'),
('Alex Padilla', 'Alex', 'Padilla', 'CA', 'Democrat', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-ca-padilla'),
('Brian Schatz', 'Brian', 'Schatz', 'HI', 'Democrat', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-hi-schatz'),
('Charles E. Schumer', 'Charles', 'Schumer', 'NY', 'Democrat', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-ny-schumer'),
('Chris Van Hollen', 'Chris', 'Van Hollen', 'MD', 'Democrat', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-md-van-hollen'),
('Raphael G. Warnock', 'Raphael', 'Warnock', 'GA', 'Democrat', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-ga-warnock'),
('Peter Welch', 'Peter', 'Welch', 'VT', 'Democrat', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-vt-welch'),
('Ron Wyden', 'Ron', 'Wyden', 'OR', 'Democrat', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-or-wyden')
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
('John Boozman', 'John', 'Boozman', 'AR', 'Republican', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-ar-boozman'),
('Katie Boyd Britt', 'Katie', 'Britt', 'AL', 'Republican', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-al-britt'),
('Ted Budd', 'Ted', 'Budd', 'NC', 'Republican', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-nc-budd'),
('Mike Crapo', 'Mike', 'Crapo', 'ID', 'Republican', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-id-crapo'),
('Chuck Grassley', 'Chuck', 'Grassley', 'IA', 'Republican', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-ia-grassley'),
('John Hoeven', 'John', 'Hoeven', 'ND', 'Republican', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-nd-hoeven'),
('Jon Husted', 'Jon', 'Husted', 'OH', 'Republican', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-oh-husted'),
('Ron Johnson', 'Ron', 'Johnson', 'WI', 'Republican', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-wi-johnson'),
('John Kennedy', 'John', 'Kennedy', 'LA', 'Republican', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-la-kennedy'),
('James Lankford', 'James', 'Lankford', 'OK', 'Republican', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-ok-lankford'),
('Mike Lee', 'Mike', 'Lee', 'UT', 'Republican', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-ut-lee'),
('Ashley Moody', 'Ashley', 'Moody', 'FL', 'Republican', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-fl-moody'),
('Jerry Moran', 'Jerry', 'Moran', 'KS', 'Republican', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-ks-moran'),
('Lisa Murkowski', 'Lisa', 'Murkowski', 'AK', 'Republican', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-ak-murkowski'),
('Rand Paul', 'Rand', 'Paul', 'KY', 'Republican', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-ky-paul'),
('Eric Schmitt', 'Eric', 'Schmitt', 'MO', 'Republican', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-mo-schmitt'),
('Tim Scott', 'Tim', 'Scott', 'SC', 'Republican', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-sc-scott'),
('John Thune', 'John', 'Thune', 'SD', 'Republican', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-sd-thune'),
('Todd Young', 'Todd', 'Young', 'IN', 'Republican', 'senate', '2023-01-03', '2029-01-03', 1, 'senate-in-young')
ON CONFLICT(external_id) DO UPDATE SET
	name = excluded.name,
	first_name = excluded.first_name,
	last_name = excluded.last_name,
	party = excluded.party,
	term_start = excluded.term_start,
	term_end = excluded.term_end,
	is_active = excluded.is_active,
	updated_at = CURRENT_TIMESTAMP;
