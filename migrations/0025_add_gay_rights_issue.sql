-- Migration number: 0025 - Add Gay Rights issue
-- Adds a Gay Rights issue with link to the specified blog post

INSERT INTO issues (
    title, 
    description, 
    party, 
    category, 
    priority, 
    is_active, 
    link1, 
    link2, 
    link3, 
    link4, 
    link5, 
    link6
) VALUES (
    'Gay Rights',
    'Support for LGBTQ+ rights, marriage equality, and anti-discrimination protections for gay and transgender individuals.',
    'Both',
    'Civil Rights',
    10,
    1,
    'https://axiom.blwaterwind.workers.dev/blog/gay-marriage-political-issue/',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
);
