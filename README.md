# Politician Voting Records Website

A web application that displays information about U.S. politicians, their voting records, and official stances. Built with Cloudflare Workers, D1 Database, and the GovTrack.us API.

## Features

- 📊 View all members of Congress (House and Senate)
- 🗳️ See detailed voting records for each politician
- 🏛️ Filter by state and chamber
- 📱 Modern, responsive UI
- 🔄 Sync data from GovTrack.us API (free, no API key required!)

## Legal Compliance

This website is designed to comply with legal requirements:

- ✅ **Voting Records**: Public facts about votes are freely republishable
- ✅ **Data Source**: Uses GovTrack.us API (open data, no API key required)
- ⚠️ **Tweets**: Does not store tweets directly. Links to official Twitter accounts and recommends using Twitter's official embed widgets
- ⚠️ **Photos**: Use only public domain images (e.g., from .gov websites) or Creative Commons licensed images

**Disclaimer**: This is not legal advice. Consult an attorney for commercial projects.

## Data Source

This project uses the **GovTrack.us API**, which provides:
- Current members of Congress
- Voting records and roll call votes
- Bill information
- No API key required (free and open)

**Note**: The ProPublica Congress API has been discontinued as of 2024. This project has been updated to use GovTrack.us as the primary data source.

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm/pnpm
- A Cloudflare account
- **No API key needed!** GovTrack API is free and open

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Create D1 Database

```bash
npx wrangler d1 create voter-politician-tool-db
```

Copy the database ID from the output and update `wrangler.json`:

```json
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_id": "YOUR_DATABASE_ID_HERE",
      "database_name": "voter-politician-tool-db"
    }
  ]
}
```

### 4. Run Migrations

Apply the database migrations:

```bash
# For local development
npx wrangler d1 migrations apply DB --local

# For production
npx wrangler d1 migrations apply DB --remote
```

### 5. Start Development Server

```bash
npm run dev
```

### 6. Sync Data

Visit `http://localhost:8787/sync` to fetch and sync data from GovTrack. This will:
- Fetch all House and Senate members
- Fetch recent votes
- Link voting records to politicians

**Note**: The sync endpoint may take a few minutes to complete as it fetches data from the GovTrack API.

### 7. Deploy

```bash
npm run deploy
```

After deployment, visit `https://your-worker.workers.dev/sync` to sync data.

## Usage

### Viewing Politicians

- Home page (`/`): Browse all politicians with filters for state and chamber
- Politician profile (`/politician/{id}`): View detailed information and voting record

### API Endpoints

- `GET /api/politicians?state=CA&chamber=house` - Get list of politicians (JSON)
- `GET /api/politician/{id}` - Get politician details with votes (JSON)
- `GET /sync` - Sync data from GovTrack API

### Syncing Data

The `/sync` endpoint fetches:
- All current House and Senate members
- Recent votes from both chambers
- Voting positions for each member

Run this periodically (e.g., daily via a cron job) to keep data up to date.

## Data Sources

- **GovTrack.us API**: https://www.govtrack.us/developers/api
  - Provides member information, voting records, and bill data
  - Free, no API key required
  - Open data source

## Twitter Integration

To display official tweets legally:

1. **Option 1**: Link to the politician's official Twitter account (implemented)
2. **Option 2**: Use Twitter's official Timeline Widget for embedded display
   - See: https://developer.twitter.com/en/docs/twitter-for-websites/timelines/overview
   - This handles copyright compliance automatically

## Project Structure

```
├── migrations/
│   ├── 0001_create_comments_table.sql (legacy)
│   └── 0002_create_politicians_tables.sql
├── src/
│   ├── index.ts          # Main application router
│   ├── db.ts             # Database operations
│   ├── govtrack.ts       # GovTrack API client
│   ├── renderHtml.ts     # HTML rendering functions
│   └── types.ts          # TypeScript type definitions
├── wrangler.json         # Cloudflare Workers configuration
└── package.json
```

## Development

```bash
# Run locally
npm run dev

# Type check
npm run check

# Deploy
npm run deploy
```

## Rate Limits

The GovTrack API is generally permissive, but be respectful:
- No official rate limits published
- Be mindful of making too many requests in a short time
- Consider caching data locally (which this app does via D1 database)

## License

This project is provided as-is for educational purposes. Ensure compliance with all applicable laws and API terms of service.

## Credits

- Data provided by [GovTrack.us](https://www.govtrack.us/)
- Built with [Cloudflare Workers](https://workers.cloudflare.com/) and [D1 Database](https://developers.cloudflare.com/d1/)
