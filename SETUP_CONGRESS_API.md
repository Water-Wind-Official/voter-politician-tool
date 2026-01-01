# Setting Up Congress.gov API

## Your API Key
Your Congress.gov API key: `wgYfmnoXscMDXBX7UcuQpLqwlivGgYAYDT0fTtIV`

## Local Development Setup

1. Create a `.dev.vars` file in the project root:
   ```
   CONGRESS_API_KEY=wgYfmnoXscMDXBX7UcuQpLqwlivGgYAYDT0fTtIV
   ```

2. Start the dev server:
   ```bash
   npm run dev
   ```

3. Visit `http://localhost:8787/sync` to sync data

## Production Setup

Set the secret in Cloudflare:

```bash
npx wrangler secret put CONGRESS_API_KEY
```

When prompted, enter: `wgYfmnoXscMDXBX7UcuQpLqwlivGgYAYDT0fTtIV`

## What Changed

- ✅ Code now uses Congress.gov API instead of GovTrack
- ✅ More reliable - official government API
- ✅ Better data structure
- ✅ No 403 errors from Cloudflare Workers

## Testing

After setting up the API key, visit `/sync` and you should see:
```json
{
  "success": true,
  "message": "Data synced successfully from Congress.gov API",
  "houseMembers": 435,
  "senateMembers": 100,
  "houseVotes": 100,
  "senateVotes": 100,
  ...
}
```
