import { Article, Location, LocationGroup, NearbyArticlesResponse } from '../types';
import { MOCK_ARTICLES, MOCK_LOCATIONS } from './mockData';
import { isMockEnabled } from './mockStore';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';
const BUILD_MOCK = !BASE_URL || process.env.EXPO_PUBLIC_USE_MOCK === 'true';

async function useMock(): Promise<boolean> {
  return BUILD_MOCK || isMockEnabled();
}

async function mockArticles(): Promise<Article[]> {
  return MOCK_ARTICLES;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json();
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export const api = {
  articles: async (): Promise<Article[]> => {
    if (await useMock()) {
      await sleep(600);
      return mockArticles();
    }
    return get('/articles');
  },

  articleById: async (id: string): Promise<Article | null> => {
    if (await useMock()) {
      await sleep(200);
      return (await mockArticles()).find((a) => a.id === id) ?? null;
    }
    return get(`/articles/${id}`);
  },

  search: async (q: string): Promise<Article[]> => {
    if (await useMock()) {
      await sleep(400);
      const lower = q.toLowerCase();
      return (await mockArticles()).filter(
        (a) =>
          a.header.toLowerCase().includes(lower) ||
          a.summary.toLowerCase().includes(lower) ||
          a.content.toLowerCase().includes(lower) ||
          a.category.toLowerCase().includes(lower) ||
          (a.region ?? '').toLowerCase().includes(lower)
      );
    }
    return get(`/search?q=${encodeURIComponent(q)}`);
  },

  articlesByLocation: async (locationId: string, limit = 100): Promise<Article[]> => {
    if (await useMock()) {
      await sleep(500);
      const loc = MOCK_LOCATIONS.find((l) => l.id === locationId);
      if (!loc) return [];
      return (await mockArticles()).filter(
        (a) => (a.region ?? '').toLowerCase().includes(loc.name.toLowerCase())
      ).slice(0, limit);
    }
    return get(`/articles/by-location/${locationId}?limit=${limit}`);
  },

  locations: async (): Promise<Location[]> => {
    if (await useMock()) {
      await sleep(300);
      return MOCK_LOCATIONS;
    }
    return get('/locations');
  },

  nearbyArticles: async (lat: number, lon: number): Promise<NearbyArticlesResponse> => {
    if (await useMock()) {
      await sleep(700);
      const articles = await mockArticles();
      const groups: LocationGroup[] = MOCK_LOCATIONS.slice(0, 1)
        .map((loc) => ({
          location_id: loc.id,
          location_name: loc.name,
          level: loc.level,
          articles: articles.filter((a) =>
            (a.region ?? '').toLowerCase().includes(loc.name.toLowerCase())
          ).slice(0, 5),
        }))
        .filter((g) => g.articles.length > 0);
      return { groups, total: groups.reduce((n, g) => n + g.articles.length, 0) };
    }
    return get(`/articles/near?lat=${lat}&lon=${lon}&search_level=1`);
  },

  nearbyArticlesByName: async (locationName: string): Promise<NearbyArticlesResponse> => {
    if (await useMock()) {
      await sleep(700);
      const articles = await mockArticles();
      const loc = MOCK_LOCATIONS.find((l) => l.name.toLowerCase() === locationName.toLowerCase());
      const groups: LocationGroup[] = loc
        ? [{
            location_id: loc.id,
            location_name: loc.name,
            level: loc.level,
            articles: articles.filter((a) =>
              (a.region ?? '').toLowerCase().includes(loc.name.toLowerCase())
            ).slice(0, 5),
          }].filter((g) => g.articles.length > 0)
        : [];
      return { groups, total: groups.reduce((n, g) => n + g.articles.length, 0) };
    }
    return get(`/articles/near?location_name=${encodeURIComponent(locationName)}&search_level=1`);
  },

  addLocation: async (name: string, level: string, parent?: string): Promise<Location> => {
    if (await useMock()) {
      await sleep(800);
      const newLoc: Location = {
        id: `loc_${Date.now()}`,
        name,
        level,
        parent: parent ?? null,
        polygon: null,
      };
      MOCK_LOCATIONS.push(newLoc);
      return newLoc;
    }
    return fetch(`${BASE_URL}/locations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, level, parent }),
    }).then((r) => {
      if (!r.ok) throw new Error(`API ${r.status}: /locations`);
      return r.json();
    });
  },
};
