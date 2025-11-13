# Iris - Project Knowledge

## Project Status
**Current Phase**: Core functionality complete, testing successful  
**Last Updated**: 2025-11-07

## Tech Stack
- **Runtime**: Cloudflare Workers
- **Framework**: Hono (TypeScript)
- **Testing**: Vitest
- **Deployment**: Wrangler CLI
- **CI/CD**: GitHub Actions (pending)
- **Frontend**: Vanilla HTML/CSS/JS (Netlify)

## Architecture: Separation of Concerns

### What Iris Does
- ✅ Detects content type from URL patterns
- ✅ Returns API endpoint (if available) or SCRAPE instruction
- ✅ Provides metadata about matched pattern

### What Iris Does NOT Do
- ❌ Define data structure schemas (consumer-owned)
- ❌ Validate response data
- ❌ Store or manage content

**Why**: KISS principle, loose coupling, easier maintenance and testing

## API Contract

**Endpoint**: `POST /classify`

**Request**:
```json
{ "url": "https://whatson.cityofsydney.nsw.gov.au/events/example" }
```

**Response** (matched):
```json
{
  "action": { "method": "SCRAPE", "reason": "No API endpoint configured" },
  "type": "EVENT",
  "meta": {
    "canonical_url": "https://...",
    "matched_pattern": "City of Sydney events from What's On portal"
  }
}
```

**Response** (unmatched):
```json
{
  "action": { "method": "SCRAPE", "reason": "No matching URL pattern found" },
  "type": "GENERIC",
  "meta": { "canonical_url": "https://...", "matched_pattern": "none" }
}
```

## Content Types
EVENT, ARTICLE, SERVICE, PROJECT, PUBLICATION, PROGRAM, COMMITTEE, PLACE, SPACE, ATTRACTION, COLLECTION, FOCUS, MEDIA, GENERIC, CATEGORY

## Current Mappings
1. **City of Sydney Events**: `whatson.cityofsydney.nsw.gov.au/events/*` → EVENT (SCRAPE)

## Data Schema Management (Option A)
Schemas live in consuming applications in `schemas/` directory with TypeScript interfaces or JSON schemas. Consumer maps Iris types to their schema definitions.

## Completed
- ✅ Wrangler authentication
- ✅ Project scaffolding
- ✅ Core classification logic with EVENT example
- ✅ 6 unit/integration tests (all passing)
- ✅ Local dev server working
- ✅ Testing frontend (local testing successful)

## Backlog
1. **P1**: Add more URL mappings as needed
2. **P1**: Deploy to Cloudflare Workers
3. **P2**: Deploy frontend to Netlify
4. **P3**: Set up CI/CD pipeline with GitHub Actions
5. **P3**: Add API endpoint mappings (when available)

## Key Files
- `src/index.ts` - Hono server, `/classify` and `/health` endpoints
- `src/mappings.ts` - URL pattern configurations
- `src/types.ts` - TypeScript interfaces
- `frontend/index.html` - Testing UI
- `project_knowledge.md` - This file

## Brand Colours
Deep Blue: #041c2c | Core Blue: #085FA1 | White: #ffffff | Light: #F2ECE7 | Green: #188838

## Next Steps
1. Add additional URL mappings
2. Deploy to Cloudflare Workers (`npm run deploy`)
3. Update frontend production endpoint
4. Deploy frontend to Netlify
