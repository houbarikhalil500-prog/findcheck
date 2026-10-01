# FindCheck MVP

FindCheck is a mobile-first decision engine: **Find → Compare → Check → Connect**.

## Run locally

Requirements: Node.js 20+.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Supabase

The app can persist searches/results to the existing `findcheck` schema when these server-only variables are present:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Copy `.env.example` to `.env.local` and fill them in. **Never expose the service role key in browser/client code.**

Without these variables, the app runs in demo mode and does not require a database.

## Search provider

The first MVP intentionally uses demo results so it can be developed without a paid search API. The `/api/search` route is the integration point for a real search provider later.

## Product safety model

- No wallet, escrow, custody, or user funds.
- No categorical claim that a business/person/site is fraudulent.
- Check results are evidence/risk signals, not a definitive trust verdict.
- Sponsored results are explicitly labeled and should remain separate from verification evidence.
