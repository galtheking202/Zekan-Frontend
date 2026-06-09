export interface Article {
  id: string;
  header: string;
  category: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  created_at: string | null;
  last_updated: string | null;
  imageUrl: string | number | null;
  credibility_score: number | null;
  external_sources: string[] | null;
  area_exterior: GeoJSONGeometry | null;
  region: string | null;
  location_ids?: string[] | null;
  is_urgent?: boolean | null;
  languages?: {
    en?: LanguageContent;
    he?: LanguageContent;
  };
}

export interface LanguageContent {
  title: string;
  summary: string;
  body?: string | null;
  key_facts?: string[] | null;
  region?: string | null;
}

export interface GeoJSONGeometry {
  type: string;
  coordinates: unknown;
}

export interface Location {
  id: string;
  name: string;
  level: string;
  parent: string | null;
  polygon: GeoJSONGeometry | null;
}

export interface LocationGroup {
  location_id: string;
  location_name: string;
  level: string;
  articles: Article[];
}

export interface NearbyArticlesResponse {
  groups: LocationGroup[];
  total: number;
}

export type AppLanguage = 'en' | 'he';

export type Category =
  | 'Politics'
  | 'Economy'
  | 'Health'
  | 'Technology'
  | 'Environment'
  | 'Defence and Security'
  | 'Sports'
  | 'Roads';
