-- Migration number: 0003 - Comprehensive schema for state-based voter information system
-- This migration creates a fully featured database schema for displaying
-- state-specific representative and voter information

-- States table - US states with metadata
CREATE TABLE IF NOT EXISTS states (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL, -- Two-letter state code (e.g., 'GA', 'CA')
    name TEXT NOT NULL, -- Full state name (e.g., 'Georgia', 'California')
    capital TEXT,
    population INTEGER,
    area_sq_miles REAL,
    timezone TEXT,
    voter_data_available BOOLEAN DEFAULT 0, -- Whether we have voter data for this state
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Congressional districts table - For House of Representatives districts
CREATE TABLE IF NOT EXISTS districts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    state_code TEXT NOT NULL,
    district_number INTEGER NOT NULL, -- District number (1-435, or NULL for at-large)
    name TEXT, -- District name if available
    population INTEGER,
    area_sq_miles REAL,
    description TEXT, -- Description of district boundaries
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (state_code) REFERENCES states(code),
    UNIQUE(state_code, district_number)
);

-- Representatives table - House and Senate members (renamed/expanded from politicians)
CREATE TABLE IF NOT EXISTS representatives (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    external_id TEXT UNIQUE, -- External ID from any source (bioguide, etc.)
    name TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    middle_name TEXT,
    suffix TEXT, -- Jr., Sr., III, etc.
    state_code TEXT NOT NULL,
    party TEXT, -- 'Democrat', 'Republican', 'Independent', etc.
    chamber TEXT NOT NULL, -- 'house' or 'senate'
    district_id INTEGER, -- Foreign key to districts (only for House members)
    office_address TEXT,
    office_phone TEXT,
    email TEXT,
    twitter_handle TEXT,
    facebook_url TEXT,
    website TEXT,
    photo_url TEXT,
    bio TEXT, -- Biography/background
    term_start DATE,
    term_end DATE,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (state_code) REFERENCES states(code),
    FOREIGN KEY (district_id) REFERENCES districts(id)
);

-- Voter data table - State-specific voter information
CREATE TABLE IF NOT EXISTS voter_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    state_code TEXT NOT NULL,
    total_registered_voters INTEGER,
    total_population INTEGER,
    voting_age_population INTEGER,
    voter_turnout_percentage REAL, -- Percentage of registered voters who voted in last election
    last_election_date DATE,
    data_source TEXT, -- Where this data came from
    data_year INTEGER, -- Year of the data
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (state_code) REFERENCES states(code),
    UNIQUE(state_code, data_year)
);

-- Voter demographics by state (for states with available data, starting with Georgia)
CREATE TABLE IF NOT EXISTS voter_demographics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    state_code TEXT NOT NULL,
    district_id INTEGER, -- NULL for state-wide demographics
    demographic_type TEXT NOT NULL, -- 'race', 'age', 'gender', 'education', 'income'
    category TEXT NOT NULL, -- e.g., 'White', '18-24', 'Male', 'High School', '$50k-$75k'
    count INTEGER,
    percentage REAL,
    data_year INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (state_code) REFERENCES states(code),
    FOREIGN KEY (district_id) REFERENCES districts(id)
);

-- Elections table - Track elections
CREATE TABLE IF NOT EXISTS elections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    state_code TEXT NOT NULL,
    election_type TEXT NOT NULL, -- 'general', 'primary', 'special', 'runoff'
    election_date DATE NOT NULL,
    office_type TEXT, -- 'president', 'senate', 'house', 'governor', etc.
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (state_code) REFERENCES states(code)
);

-- Election results table - Results for specific elections
CREATE TABLE IF NOT EXISTS election_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    election_id INTEGER NOT NULL,
    representative_id INTEGER, -- The candidate/winner
    district_id INTEGER, -- For House elections
    votes_received INTEGER,
    vote_percentage REAL,
    is_winner BOOLEAN DEFAULT 0,
    party TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (election_id) REFERENCES elections(id),
    FOREIGN KEY (representative_id) REFERENCES representatives(id),
    FOREIGN KEY (district_id) REFERENCES districts(id)
);

-- Keep existing votes and voting_records tables but update them
-- Votes table (keep existing structure, just ensure it exists)
CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    propublica_roll_id TEXT UNIQUE NOT NULL,
    bill_id TEXT,
    bill_title TEXT,
    bill_number TEXT,
    description TEXT,
    question TEXT,
    date TEXT NOT NULL,
    chamber TEXT NOT NULL,
    result TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Voting records table (keep existing structure)
CREATE TABLE IF NOT EXISTS voting_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    politician_id INTEGER NOT NULL, -- Note: This references old politicians table, will need migration
    vote_id INTEGER NOT NULL,
    position TEXT NOT NULL,
    FOREIGN KEY (vote_id) REFERENCES votes(id) ON DELETE CASCADE,
    UNIQUE(politician_id, vote_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_states_code ON states(code);
CREATE INDEX IF NOT EXISTS idx_districts_state ON districts(state_code);
CREATE INDEX IF NOT EXISTS idx_representatives_state ON representatives(state_code);
CREATE INDEX IF NOT EXISTS idx_representatives_chamber ON representatives(chamber);
CREATE INDEX IF NOT EXISTS idx_representatives_active ON representatives(is_active);
CREATE INDEX IF NOT EXISTS idx_voter_data_state ON voter_data(state_code);
CREATE INDEX IF NOT EXISTS idx_voter_demographics_state ON voter_demographics(state_code);
CREATE INDEX IF NOT EXISTS idx_elections_state ON elections(state_code);
CREATE INDEX IF NOT EXISTS idx_election_results_election ON election_results(election_id);

-- Insert all 50 US states
INSERT INTO states (code, name, capital, timezone, voter_data_available) VALUES
    ('AL', 'Alabama', 'Montgomery', 'CST', 0),
    ('AK', 'Alaska', 'Juneau', 'AKST', 0),
    ('AZ', 'Arizona', 'Phoenix', 'MST', 0),
    ('AR', 'Arkansas', 'Little Rock', 'CST', 0),
    ('CA', 'California', 'Sacramento', 'PST', 0),
    ('CO', 'Colorado', 'Denver', 'MST', 0),
    ('CT', 'Connecticut', 'Hartford', 'EST', 0),
    ('DE', 'Delaware', 'Dover', 'EST', 0),
    ('FL', 'Florida', 'Tallahassee', 'EST', 0),
    ('GA', 'Georgia', 'Atlanta', 'EST', 1), -- Starting with Georgia
    ('HI', 'Hawaii', 'Honolulu', 'HST', 0),
    ('ID', 'Idaho', 'Boise', 'MST', 0),
    ('IL', 'Illinois', 'Springfield', 'CST', 0),
    ('IN', 'Indiana', 'Indianapolis', 'EST', 0),
    ('IA', 'Iowa', 'Des Moines', 'CST', 0),
    ('KS', 'Kansas', 'Topeka', 'CST', 0),
    ('KY', 'Kentucky', 'Frankfort', 'EST', 0),
    ('LA', 'Louisiana', 'Baton Rouge', 'CST', 0),
    ('ME', 'Maine', 'Augusta', 'EST', 0),
    ('MD', 'Maryland', 'Annapolis', 'EST', 0),
    ('MA', 'Massachusetts', 'Boston', 'EST', 0),
    ('MI', 'Michigan', 'Lansing', 'EST', 0),
    ('MN', 'Minnesota', 'Saint Paul', 'CST', 0),
    ('MS', 'Mississippi', 'Jackson', 'CST', 0),
    ('MO', 'Missouri', 'Jefferson City', 'CST', 0),
    ('MT', 'Montana', 'Helena', 'MST', 0),
    ('NE', 'Nebraska', 'Lincoln', 'CST', 0),
    ('NV', 'Nevada', 'Carson City', 'PST', 0),
    ('NH', 'New Hampshire', 'Concord', 'EST', 0),
    ('NJ', 'New Jersey', 'Trenton', 'EST', 0),
    ('NM', 'New Mexico', 'Santa Fe', 'MST', 0),
    ('NY', 'New York', 'Albany', 'EST', 0),
    ('NC', 'North Carolina', 'Raleigh', 'EST', 0),
    ('ND', 'North Dakota', 'Bismarck', 'CST', 0),
    ('OH', 'Ohio', 'Columbus', 'EST', 0),
    ('OK', 'Oklahoma', 'Oklahoma City', 'CST', 0),
    ('OR', 'Oregon', 'Salem', 'PST', 0),
    ('PA', 'Pennsylvania', 'Harrisburg', 'EST', 0),
    ('RI', 'Rhode Island', 'Providence', 'EST', 0),
    ('SC', 'South Carolina', 'Columbia', 'EST', 0),
    ('SD', 'South Dakota', 'Pierre', 'CST', 0),
    ('TN', 'Tennessee', 'Nashville', 'CST', 0),
    ('TX', 'Texas', 'Austin', 'CST', 0),
    ('UT', 'Utah', 'Salt Lake City', 'MST', 0),
    ('VT', 'Vermont', 'Montpelier', 'EST', 0),
    ('VA', 'Virginia', 'Richmond', 'EST', 0),
    ('WA', 'Washington', 'Olympia', 'PST', 0),
    ('WV', 'West Virginia', 'Charleston', 'EST', 0),
    ('WI', 'Wisconsin', 'Madison', 'CST', 0),
    ('WY', 'Wyoming', 'Cheyenne', 'MST', 0),
    ('DC', 'District of Columbia', 'Washington', 'EST', 0)
ON CONFLICT(code) DO NOTHING;
