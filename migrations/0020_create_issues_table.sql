-- Migration number: 0020 - Create issues table for political issues management

CREATE TABLE issues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    party TEXT NOT NULL CHECK (party IN ('Democrat', 'Republican', 'Both')),
    category TEXT,
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_issues_party ON issues(party);
CREATE INDEX idx_issues_category ON issues(category);
CREATE INDEX idx_issues_priority ON issues(priority);
CREATE INDEX idx_issues_active ON issues(is_active);