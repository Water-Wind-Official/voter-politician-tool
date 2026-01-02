# Converting Excel to JSON for Voter Data Import

## Step 1: Prepare Your Excel Data

Your `vote04a_2024.xlsx` file should have columns like:
- State Code (2-letter code like CA, TX, FL)
- State Name (full name like California, Texas, Florida)
- Total Registered Voters
- Voting Age Population
- Voter Turnout Percentage (the key metric you want!)
- Total Population

## Step 2: Convert Excel to JSON

### Option A: Online Converter (Recommended)
1. Go to: https://www.convertcsv.com/csv-to-json.htm
2. Upload your Excel file (or copy-paste the data)
3. Make sure the first row contains headers
4. Click "Convert to JSON"
5. Copy the resulting JSON

### Option B: Excel to CSV then CSV to JSON
1. Open your Excel file
2. Save as CSV (File > Save As > CSV)
3. Use an online CSV to JSON converter
4. Copy the JSON output

## Step 3: Format the JSON

Your JSON should look like this:
```json
[
  {
    "state_code": "CA",
    "state_name": "California",
    "total_registered_voters": 21900000,
    "voting_age_population": 28500000,
    "voter_turnout_percentage": 62.5,
    "total_population": 39500000
  },
  {
    "state_code": "TX",
    "state_name": "Texas",
    "total_registered_voters": 18500000,
    "voting_age_population": 22000000,
    "voter_turnout_percentage": 58.2,
    "total_population": 30000000
  }
]
```

## Step 4: Import in Admin Panel

1. Go to your admin dashboard: `/admin`
2. Click "Voter Data" tab
3. Click "📊 Import from Excel" button
4. Paste your JSON data
5. Click "📊 Import Data"

## Supported Field Names

The import tool will automatically map these field names:
- `state_code` or `State` or `state`
- `total_registered_voters` or `registered_voters` or `Registered`
- `voting_age_population` or `voting_age` or `Voting_Age`
- `voter_turnout_percentage` or `turnout_percentage` or `Turnout` or `Turnout (%)`
- `total_population` or `total_pop` or `Population`

## What Gets Imported

- **State Code**: Must be 2-letter code (CA, TX, FL, etc.)
- **Voter Turnout %**: The percent of adult population that voted (your key metric!)
- **Registered Voters**: Total registered voters
- **Voting Age Population**: Adults 18+
- **Total Population**: Full state population
- **Data Year**: Set to 2024
- **Source**: Marked as "2024 Election Data (vote04a_2024.xlsx)"

## After Import

Once imported, you'll see:
- Voter turnout percentages on state cards
- Detailed voter data in state popups
- Election statistics in the Election Hub

You can then safely delete the `vote04a_2024.xlsx` file!