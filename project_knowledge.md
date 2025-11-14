# Iris - Project Knowledge

## Project Status
**Current Phase**: Production-ready with comprehensive City of Sydney mappings  
**Last Updated**: 2025-11-14

## Tech Stack
- **Runtime**: Cloudflare Workers
- **Framework**: Hono (TypeScript)
- **Testing**: Vitest
- **Deployment**: Wrangler CLI
- **CI/CD**: GitHub Actions (pending)
- **Frontend**: Vanilla HTML/CSS/JS with mappings reference display

## Architecture: Separation of Concerns

### What Iris Does
- ✅ Detects content type from URL patterns
- ✅ Returns API endpoint (if available) or SCRAPE instruction
- ✅ Provides metadata about matched pattern and composite types
- ✅ Exposes mappings documentation via `/mappings` endpoint

### What Iris Does NOT Do
- ❌ Define data structure schemas (consumer-owned)
- ❌ Validate response data
- ❌ Store or manage content

**Why**: KISS principle, loose coupling, easier maintenance and testing

## API Contract

### POST /classify
**Request**:
```json
{ "url": "https://whatson.cityofsydney.nsw.gov.au/events/example" }
```

**Response** (matched with API):
```json
{
  "action": {
    "method": "API",
    "endpoint": "https://whatson.cityofsydney.nsw.gov.au/api/events/example"
  },
  "type": "EVENT",
  "meta": {
    "canonical_url": "https://...",
    "matched_pattern": "City of Sydney events from What's On portal"
  }
}
```

**Response** (matched without API):
```json
{
  "action": { "method": "SCRAPE", "reason": "No API endpoint configured" },
  "type": "CATEGORY",
  "meta": {
    "canonical_url": "https://...",
    "matched_pattern": "City of Sydney articles from News portal",
    "contains_type": "ARTICLE"
  }
}
```

### GET /mappings
Returns all URL pattern configurations:
```json
{
  "total": 168,
  "mappings": [
    {
      "id": 1,
      "pattern": "...",
      "type": "EVENT",
      "description": "...",
      "hasApiEndpoint": true,
      "containsType": "EVENT"
    }
  ]
}
```

### GET /health
```json
{ "status": "ok", "service": "iris" }
```

## Content Types
**Individual Types**: EVENT, ARTICLE, SERVICE, PROJECT, PUBLICATION, PROGRAM, COMMITTEE, PLACE, SPACE, ATTRACTION, COLLECTION, FOCUS, MEDIA, GENERIC

**Composite Type**: CATEGORY (with `contains_type` indicating item type)

## Current Mappings: City of Sydney (168 patterns)

### whatson.cityofsydney.nsw.gov.au (72 patterns)
- Events (single + list views): API + SCRAPE
- Venues, categories, dates: CATEGORY pages with `contains_type: EVENT`

### news.cityofsydney.nsw.gov.au (48 patterns)
- Articles (single + list): API + SCRAPE
- Categories, dates: CATEGORY pages with `contains_type: ARTICLE`

### www.cityofsydney.nsw.gov.au (48 patterns)
- Services, projects, publications, programs, committees
- Places, spaces, attractions, collections, focus areas
- All SCRAPE-only (no APIs configured)

## Key Design Patterns

### Composite Types
Category pages use `contains_type` field rather than separate list types:
- `type: "CATEGORY"` + `contains_type: "EVENT"` (not "EVENT_LIST")
- Keeps type system simple while conveying list semantics

### Dynamic API Endpoints
Template literals with regex capture groups enable flexible endpoint construction:
```typescript
pattern: /^https:\/\/whatson\.cityofsydney\.nsw\.gov\.au\/events\/([^\/]+)$/
getEndpoint: (match) => `https://whatson.../api/events/${match[1]}`
```

## File Structure
```
D:\Iris\
├── src/
│   ├── index.ts       # Hono server with /classify, /mappings, /health
│   ├── mappings.ts    # 168 URL pattern configs
│   └── types.ts       # TypeScript interfaces
├── frontend/
│   └── index.html     # Test UI with expandable mappings reference
├── wrangler.toml      # Cloudflare Workers config (no [build] section)
└── package.json       # Dependencies
```

## Brand Colours
Deep Blue: #041c2c | Core Blue: #085FA1 | White: #ffffff | Light: #F2ECE7 | Green: #188838  
**Font**: Helvetica

## Completed
- ✅ Core classification logic
- ✅ 168 City of Sydney URL patterns
- ✅ Composite type system with `contains_type`
- ✅ Dynamic API endpoint construction
- ✅ `/mappings` documentation endpoint
- ✅ Testing frontend with collapsible mappings display
- ✅ Local dev environment working

## Backlog
1. **P1**: Deploy to Cloudflare Workers (`npm run deploy`)
2. **P2**: Update frontend production endpoint URL
3. **P2**: Deploy frontend to Netlify
4. **P3**: Add unit tests for new mapping patterns
5. **P3**: Set up CI/CD pipeline with GitHub Actions

## Critical Deployment Notes
- Remove `[build]` section from `wrangler.toml` (Wrangler handles TypeScript directly)
- Set `compatibility_date` to current date
- Create `src/` directory before writing TypeScript files
- Use `--break-system-packages` flag for pip installations

## Next Steps
1. Deploy to Cloudflare Workers
2. Test production endpoint
3. Update frontend with production URL
4. Deploy frontend to Netlify
