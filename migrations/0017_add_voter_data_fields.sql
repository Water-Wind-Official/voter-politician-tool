-- Migration number: 0017 - Add comprehensive voter data fields to voter_data table
-- Adds detailed voter registration and turnout statistics

ALTER TABLE voter_data ADD COLUMN citizen_voting_age_population INTEGER; -- Total citizens over voting age
ALTER TABLE voter_data ADD COLUMN percent_registered_total REAL; -- Percent registered (total population)
ALTER TABLE voter_data ADD COLUMN percent_registered_total_margin REAL; -- Margin of error for percent registered total
ALTER TABLE voter_data ADD COLUMN percent_registered_citizen REAL; -- Percent registered (citizens only)
ALTER TABLE voter_data ADD COLUMN percent_registered_citizen_margin REAL; -- Margin of error for percent registered citizen
ALTER TABLE voter_data ADD COLUMN total_voted INTEGER; -- Total who voted
ALTER TABLE voter_data ADD COLUMN percent_voted_total REAL; -- Percent voted (total population)
ALTER TABLE voter_data ADD COLUMN percent_voted_total_margin REAL; -- Margin of error for percent voted total
ALTER TABLE voter_data ADD COLUMN percent_voted_citizen REAL; -- Percent voted (citizens only)
ALTER TABLE voter_data ADD COLUMN percent_voted_citizen_margin REAL; -- Margin of error for percent voted citizen