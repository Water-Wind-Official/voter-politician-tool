-- Migration number: 0022 - Create moneyhub table for campaign funding and lobby entries

CREATE TABLE moneyhub (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    party TEXT NOT NULL CHECK (party IN ('Democrat', 'Republican', 'Both')),
    category TEXT,
    priority INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    link1 TEXT,
    link2 TEXT,
    link3 TEXT,
    link4 TEXT,
    link5 TEXT,
    link6 TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_moneyhub_party ON moneyhub(party);
CREATE INDEX idx_moneyhub_category ON moneyhub(category);
CREATE INDEX idx_moneyhub_priority ON moneyhub(priority);
CREATE INDEX idx_moneyhub_active ON moneyhub(is_active);
