import { describe, it, expect } from 'vitest';
import app from './index';

describe('POST /classify', () => {
  it('should classify City of Sydney event URL', async () => {
    const req = new Request('http://localhost/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://whatson.cityofsydney.nsw.gov.au/events/chin-chin-exclusive-new-years-eve-burlesque-show-and-dinner',
      }),
    });

    const res = await app.fetch(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.type).toBe('EVENT');
    expect(data.action.method).toBe('SCRAPE');
    expect(data.meta.canonical_url).toContain('whatson.cityofsydney.nsw.gov.au');
  });

  it('should return SCRAPE for unmatched URL', async () => {
    const req = new Request('http://localhost/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://example.com/unknown-page',
      }),
    });

    const res = await app.fetch(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.type).toBe('GENERIC');
    expect(data.action.method).toBe('SCRAPE');
    expect(data.action.reason).toBe('No matching URL pattern found');
  });

  it('should return 400 for missing URL', async () => {
    const req = new Request('http://localhost/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const res = await app.fetch(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain('URL is required');
  });

  it('should return 400 for invalid URL format', async () => {
    const req = new Request('http://localhost/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'not-a-valid-url',
      }),
    });

    const res = await app.fetch(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Invalid URL format');
  });

  it('should return 400 for empty URL string', async () => {
    const req = new Request('http://localhost/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: '   ',
      }),
    });

    const res = await app.fetch(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain('URL is required');
  });
});

describe('GET /health', () => {
  it('should return health status', async () => {
    const req = new Request('http://localhost/health', {
      method: 'GET',
    });

    const res = await app.fetch(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.status).toBe('ok');
    expect(data.service).toBe('iris');
  });
});
