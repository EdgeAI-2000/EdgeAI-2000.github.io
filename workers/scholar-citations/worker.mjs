const TITLE = 'Rethinking What to Communicate for Collaborative Perception: A Parameter-Centric Perspective';
const PATH = '/stats/projects/paracomm/citations.json';
const CACHE_KEY = 'paracomm-citations';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Accept, Content-Type',
    'Cache-Control': 'public, max-age=300',
    Vary: 'Origin',
  };
}

function json(status, data, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...corsHeaders(), ...extra },
  });
}

function scholarUrl(env) {
  return env.SCHOLAR_URL || `https://scholar.google.com/scholar?q=${encodeURIComponent(`"${TITLE}"`)}`;
}

function scholarQuery(env) {
  return env.SCHOLAR_QUERY || `"${TITLE}"`;
}

function cacheTtl(env) {
  const ttl = Number(env.CACHE_TTL_SECONDS);
  return Number.isFinite(ttl) && ttl > 0 ? ttl : 43200;
}

function normalizeTitle(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function parseCitations(payload) {
  const results = Array.isArray(payload?.organic_results) ? payload.organic_results : [];
  const expected = normalizeTitle(TITLE);
  const match = results.find((item) => {
    const title = normalizeTitle(item?.title);
    return title && (title.includes(expected) || expected.includes(title));
  });
  if (!match) return null;
  const total = match.inline_links?.cited_by?.total;
  if (total == null) return 0;
  const count = Number(total);
  if (!Number.isFinite(count) || count < 0) return null;
  return count;
}

async function readCache(env) {
  if (!env.CACHE) return null;
  try {
    return await env.CACHE.get(CACHE_KEY, 'json');
  } catch {
    return null;
  }
}

async function writeCache(env, data) {
  if (!env.CACHE) return;
  await env.CACHE.put(CACHE_KEY, JSON.stringify(data), { expirationTtl: cacheTtl(env) });
}

async function fetchScholar(env) {
  if (!env.SERPAPI_API_KEY) return null;
  const params = new URLSearchParams({
    engine: 'google_scholar',
    q: scholarQuery(env),
    api_key: env.SERPAPI_API_KEY,
  });
  const response = await fetch(`https://serpapi.com/search.json?${params}`);
  if (!response.ok) throw new Error(`serpapi ${response.status}`);
  return parseCitations(await response.json());
}

async function citationsPayload(env) {
  const cached = await readCache(env);
  try {
    const count = await fetchScholar(env);
    if (typeof count === 'number') {
      const fresh = {
        path: 'projects/paracomm/citations',
        citations: count,
        source: 'google-scholar',
        scholar_url: scholarUrl(env),
      };
      await writeCache(env, fresh);
      return fresh;
    }
  } catch (error) {
    if (!cached) throw error;
  }
  return cached;
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders() });
    if (request.method !== 'GET') return json(405, { error: 'method not allowed' });
    const path = new URL(request.url).pathname;
    if (path !== PATH && path !== '/') return json(404, { error: 'not found' });
    try {
      const data = await citationsPayload(env);
      if (!data || typeof data.citations !== 'number') {
        return json(404, { error: 'citations unavailable', source: 'google-scholar' });
      }
      return json(200, data);
    } catch {
      return json(502, { error: 'scholar lookup failed', source: 'google-scholar' });
    }
  },
};
