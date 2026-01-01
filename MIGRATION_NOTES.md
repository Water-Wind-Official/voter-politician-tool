# Migration from ProPublica to GovTrack API

## What Changed

The ProPublica Congress API has been **discontinued** as of 2024. This project has been updated to use **GovTrack.us API** instead.

## Key Differences

### ProPublica (Old - Discontinued)
- ❌ Required API key
- ❌ Service discontinued
- ❌ Rate limits

### GovTrack (New - Current)
- ✅ **No API key required** - completely free and open
- ✅ Active service
- ✅ Open data source
- ✅ Similar data structure

## Code Changes

1. **Removed**: `src/propublica.ts` - ProPublica API client
2. **Added**: `src/govtrack.ts` - GovTrack API client
3. **Updated**: `src/index.ts` - Sync function now uses GovTrack
4. **Updated**: `src/db.ts` - Generic interfaces for multiple data sources
5. **Updated**: `src/types.ts` - Added GovTrack types

## Setup Changes

### Before (ProPublica)
```bash
# Required API key setup
PROPUBLICA_API_KEY=your_key_here
```

### Now (GovTrack)
```bash
# No setup needed!
# Just run: npm run dev
```

## API Endpoints

The `/sync` endpoint works the same way, but now:
- Fetches from GovTrack instead of ProPublica
- No API key required
- Same data structure in database

## Data Compatibility

The database schema remains the same. Data from both sources is stored identically:
- `propublica_id` field now stores GovTrack IDs (prefixed with `govtrack-`)
- All other fields work the same way

## Testing

1. Run `npm run dev`
2. Visit `http://localhost:8787/sync`
3. Check that politicians and votes are synced successfully

## Benefits

- ✅ **Simpler setup** - No API key needed
- ✅ **Free forever** - GovTrack is open data
- ✅ **Reliable** - Active service with good uptime
- ✅ **Same features** - All functionality preserved
