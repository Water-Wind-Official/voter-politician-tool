# Troubleshooting Guide

## 403 Forbidden Error from GovTrack API

If you're getting a `403 Forbidden` error when trying to sync data, this is likely because GovTrack is blocking requests from Cloudflare Workers.

### Why This Happens

GovTrack may have security measures that block:
- Requests from Cloudflare Workers IP ranges
- Automated requests without proper identification
- Requests missing required headers

### Solutions

#### Option 1: Use Official Congress.gov API (Recommended)

The official Congress.gov API is more reliable and designed for programmatic access:

1. **Get a free API key**: https://api.congress.gov/sign-up
2. **Update the code** to use `src/congressgov.ts` instead of `src/govtrack.ts`
3. **Set the API key** as an environment variable: `CONGRESS_API_KEY`

#### Option 2: Run Sync from Different Environment

Run the sync script from:
- Your local machine
- A different hosting provider (not Cloudflare Workers)
- A VPS or server you control

#### Option 3: Add Proxy/Headers

Try adding more headers or using a proxy service, though this may not work if GovTrack blocks Cloudflare IPs entirely.

#### Option 4: Contact GovTrack

Reach out to GovTrack support to request API access or whitelist your use case.

### Quick Fix: Switch to Congress.gov API

1. Update `src/index.ts` to import from `congressgov.ts`:
   ```typescript
   import { 
       fetchCongressMembers, 
       fetchCongressVotes, 
       convertCongressMember 
   } from "./congressgov";
   ```

2. Update the sync function to use Congress.gov API

3. Set environment variable:
   ```bash
   npx wrangler secret put CONGRESS_API_KEY
   ```

### Alternative Data Sources

If both APIs don't work, consider:
- **OpenStates API** (for state-level data)
- **Vote Smart API** (for candidate information)
- **Manual data entry** (for small-scale projects)

## Other Common Issues

### Database Not Found
- Make sure you've run migrations: `npx wrangler d1 migrations apply DB --local`
- Check that `wrangler.json` has the correct `database_id`

### No Politicians Showing
- Run the sync endpoint: `/sync`
- Check browser console for errors
- Verify database has data: Check D1 database in Cloudflare dashboard

### TypeScript Errors
- These are often IDE false positives
- Cloudflare Workers types are provided at runtime
- Code should work even if IDE shows errors
