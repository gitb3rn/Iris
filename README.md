# Iris

URL classification microservice that determines the optimal data retrieval method for web content.

## Overview

Iris analyses URLs and returns:
- **Content type** (EVENT, ARTICLE, SERVICE, etc.)
- **Retrieval method** (API or SCRAPE)
- **API endpoint** (if available)

Built with Hono on Cloudflare Workers for global low-latency performance.

## Architecture

Iris follows a **separation of concerns** approach:
- ✅ Classifies URLs and determines routing
- ❌ Does NOT define data schemas (owned by consuming applications)

See `project_knowledge.md` for detailed architecture decisions.

## API

### POST /classify

Classify a URL and determine retrieval method.

**Request:**
```json
{
  "url": "https://whatson.cityofsydney.nsw.gov.au/events/summer-festival"
}
```

**Response (API method):**
```json
{
  "action": {
    "method": "API",
    "endpoint": "https://api.example.com/v1/events/summer-festival"
  },
  "type": "EVENT",
  "meta": {
    "canonical_url": "https://whatson.cityofsydney.nsw.gov.au/events/summer-festival",
    "matched_pattern": "City of Sydney events from What's On portal"
  }
}
```

**Response (SCRAPE fallback):**
```json
{
  "action": {
    "method": "SCRAPE",
    "reason": "No matching URL pattern found"
  },
  "type": "GENERIC",
  "meta": {
    "canonical_url": "https://example.com/unknown",
    "matched_pattern": "none"
  }
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "iris"
}
```

## Development

### Prerequisites
- Node.js (LTS)
- Cloudflare account
- Wrangler CLI authenticated (`wrangler login`)

### Install Dependencies
```bash
npm install
```

### Run Locally
```bash
npm run dev
```

Server runs at `http://localhost:8787`

### Run Tests
```bash
npm test           # Run once
npm run test:watch # Watch mode
```

### Deploy
```bash
npm run deploy
```

## Adding URL Patterns

Edit `src/mappings.ts`:

```typescript
{
  pattern: /^https?:\/\/example\.com\/events\/([^\/]+)/,
  type: 'EVENT',
  description: 'Example events',
  getEndpoint: (match) => `https://api.example.com/v1/events/${match[1]}`
}
```

## Configuration

Configure `wrangler.toml` for your Cloudflare account:
- Update `name` if needed
- Ensure `compatibility_date` is current

## Tech Stack
- **Runtime**: Cloudflare Workers
- **Framework**: Hono
- **Language**: TypeScript
- **Testing**: Vitest
- **Deployment**: Wrangler CLI

## Project Structure
```
src/
├── index.ts       # Hono server and endpoints
├── types.ts       # TypeScript interfaces
├── mappings.ts    # URL pattern configurations
└── index.test.ts  # Vitest tests
```

## Licence
MIT
