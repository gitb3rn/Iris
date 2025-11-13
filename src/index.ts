import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type {
  ClassificationRequest,
  ClassificationResponse,
  ErrorResponse,
} from './types';
import { urlMappings } from './mappings';

const app = new Hono();

// Enable CORS for front-end testing
app.use('/*', cors());

app.post('/classify', async (c) => {
  try {
    const body = await c.req.json<ClassificationRequest>();

    // Validate request
    if (!body.url || typeof body.url !== 'string' || body.url.trim() === '') {
      const errorResponse: ErrorResponse = {
        error: 'URL is required and must be a valid string',
      };
      return c.json(errorResponse, 400);
    }

    const url = body.url.trim();

    // Attempt to parse URL to validate format
    try {
      new URL(url);
    } catch {
      const errorResponse: ErrorResponse = {
        error: 'Invalid URL format',
      };
      return c.json(errorResponse, 400);
    }

    // Iterate through mappings to find a match
    for (const mapping of urlMappings) {
      const match = url.match(mapping.pattern);
      
      if (match) {
        const response: ClassificationResponse = {
          action: mapping.getEndpoint
            ? {
                method: 'API',
                endpoint: mapping.getEndpoint(match),
              }
            : {
                method: 'SCRAPE',
                reason: 'No API endpoint configured for this pattern',
              },
          type: mapping.type,
          meta: {
            canonical_url: url,
            matched_pattern: mapping.description,
            ...(mapping.containsType && { contains_type: mapping.containsType }),
          },
        };
        
        return c.json(response, 200);
      }
    }

    // No mapping found - return SCRAPE fallback
    const fallbackResponse: ClassificationResponse = {
      action: {
        method: 'SCRAPE',
        reason: 'No matching URL pattern found',
      },
      type: 'GENERIC',
      meta: {
        canonical_url: url,
        matched_pattern: 'none',
      },
    };

    return c.json(fallbackResponse, 200);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      error: 'Invalid request body',
    };
    return c.json(errorResponse, 400);
  }
});

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok', service: 'iris' });
});

// Mappings info endpoint
app.get('/mappings', (c) => {
  const mappingsInfo = urlMappings.map((mapping, index) => ({
    id: index + 1,
    pattern: mapping.pattern.source,
    type: mapping.type,
    description: mapping.description,
    hasApiEndpoint: !!mapping.getEndpoint,
    ...(mapping.containsType && { containsType: mapping.containsType }),
  }));
  
  return c.json({
    total: mappingsInfo.length,
    mappings: mappingsInfo,
  });
});

export default app;
