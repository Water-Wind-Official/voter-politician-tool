-- Migration number: 0002 	 2024-12-27T22:04:18.794Z
-- Create politicians table
CREATE TABLE IF NOT EXISTS politicians (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    propublica_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    state TEXT NOT NULL,
    party TEXT,
    chamber TEXT NOT NULL, -- 'house' or 'senate'
    district TEXT, -- For house members
    twitter_handle TEXT,
    website TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create votes table (bills/roll calls)
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
    result TEXT, -- 'Passed' or 'Failed'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create voting_records table (links politicians to their votes)
CREATE TABLE IF NOT EXISTS voting_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    politician_id INTEGER NOT NULL,
    vote_id INTEGER NOT NULL,
    position TEXT NOT NULL, -- 'Yes', 'No', 'Not Voting', 'Present'
    FOREIGN KEY (politician_id) REFERENCES politicians(id) ON DELETE CASCADE,
    FOREIGN KEY (vote_id) REFERENCES votes(id) ON DELETE CASCADE,
    UNIQUE(politician_id, vote_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_politicians_state ON politicians(state);
CREATE INDEX IF NOT EXISTS idx_politicians_chamber ON politicians(chamber);
CREATE INDEX IF NOT EXISTS idx_votes_date ON votes(date);
CREATE INDEX IF NOT EXISTS idx_voting_records_politician ON voting_records(politician_id);
CREATE INDEX IF NOT EXISTS idx_voting_records_vote ON voting_records(vote_id);
