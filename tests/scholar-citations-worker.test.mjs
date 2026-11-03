import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../workers/scholar-citations/worker.mjs';

const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });

function request(path = '/stats/projects/paracomm/citations.json', method = 'GET') {
  return new Request(`https://dl.eaislab.com${path}`, { method, headers: { Accept: 'application/json' } });
}

function scholarHit(total = 3) {
  return {
    organic_results: [{
      title: 'Rethinking What to Communicate for Collaborative Perception: A Parameter-Centric Perspective',
      inline_links: { cited_by: { total } },
    }],
  };
}

test('preflight is open CORS so the static Pages site can read the count', async () => {
  const response = await worker.fetch(request('/stats/projects/paracomm/citations.json', 'OPTIONS'), {});
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
});

test('unknown paths and methods do not call SerpAPI', async () => {
  globalThis.fetch = () => { throw new Error('must not call'); };
  assert.equal((await worker.fetch(request('/other.json'), {})).status, 404);
  assert.equal((await worker.fetch(request('/stats/projects/paracomm/citations.json', 'POST'), {})).status, 405);
});

test('without a SerpAPI key or cache the badge must not invent a number', async () => {
  globalThis.fetch = () => { throw new Error('must not call'); };
  const response = await worker.fetch(request(), {});
  assert.equal(response.status, 404);
  const body = await response.json();
  assert.equal(body.citations, undefined);
  assert.equal(body.source, 'google-scholar');
});

test('reads cited_by.total from a matching Google Scholar result', async () => {
  globalThis.fetch = async (url) => {
    assert.match(String(url), /serpapi\.com\/search\.json/);
    assert.match(String(url), /engine=google_scholar/);
    return Response.json(scholarHit(4));
  };
  const response = await worker.fetch(request(), { SERPAPI_API_KEY: 'test-key' });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
  const body = await response.json();
  assert.equal(body.citations, 4);
  assert.equal(body.source, 'google-scholar');
  assert.equal(body.path, 'projects/paracomm/citations');
  assert.match(body.scholar_url, /scholar\.google\.com\/scholar/);
});

test('a matching Scholar hit with no cited_by block is a real zero, not a missing count', async () => {
  globalThis.fetch = async () => Response.json({
    organic_results: [{ title: 'Rethinking What to Communicate for Collaborative Perception: A Parameter-Centric Perspective' }],
  });
  const body = await (await worker.fetch(request(), { SERPAPI_API_KEY: 'test-key' })).json();
  assert.equal(body.citations, 0);
});

test('a different paper must not be counted as ParaComm', async () => {
  globalThis.fetch = async () => Response.json({
    organic_results: [{ title: 'Some other collaborative perception paper', inline_links: { cited_by: { total: 99 } } }],
  });
  const response = await worker.fetch(request(), { SERPAPI_API_KEY: 'test-key' });
  assert.equal(response.status, 404);
});

test('cached Scholar JSON is used when SerpAPI fails', async () => {
  const cache = {
    async get() {
      return { path: 'projects/paracomm/citations', citations: 2, source: 'google-scholar', scholar_url: 'https://scholar.google.com/scholar' };
    },
    async put() { throw new Error('should not write'); },
  };
  globalThis.fetch = async () => new Response('no', { status: 500 });
  const body = await (await worker.fetch(request(), { SERPAPI_API_KEY: 'test-key', CACHE: cache })).json();
  assert.equal(body.citations, 2);
});
