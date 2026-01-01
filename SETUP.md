# Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install
```

**Note**: No API key needed! GovTrack API is free and open.

## Step 2: Create D1 Database

```bash
npx wrangler d1 create voter-politician-tool-db
```

Copy the `database_id` from the output.

## Step 3: Update wrangler.json

Open `wrangler.json` and update the `database_id`:

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

## Step 4: Run Migrations

```bash
# Local database
npx wrangler d1 migrations apply DB --local

# Production database (after first deploy)
npx wrangler d1 migrations apply DB --remote
```

## Step 5: Start Development Server

```bash
npm run dev
```

## Step 6: Sync Data

Open your browser and visit:
```
http://localhost:8787/sync
```

This will fetch all politicians and recent votes from GovTrack. Wait for it to complete (may take 1-2 minutes).

## Step 7: View Your Site

Visit:
```
http://localhost:8787
```

You should see a list of all politicians!

## Deploy to Production

1. Deploy:
   ```bash
   npm run deploy
   ```

2. After deployment, visit `https://your-worker.workers.dev/sync` to sync data

**Note**: No API keys or secrets needed - GovTrack API is completely free and open!

## Troubleshooting

### "Database not found"
- Make sure you ran the migrations: `npx wrangler d1 migrations apply DB --local`
- Check that `wrangler.json` has the correct `database_id`

### No politicians showing
- Visit `/sync` to fetch data from GovTrack
- Check the browser console for errors
- The sync process may take a few minutes

### Sync errors
- Check your internet connection
- GovTrack API may be temporarily unavailable (rare)
- Try again after a few minutes

## Data Source

This project uses **GovTrack.us API** which:
- ✅ Is completely free
- ✅ Requires no API key
- ✅ Provides current Congress data
- ✅ Includes voting records

No registration or API key setup needed!
