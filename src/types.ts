/**
 * TypeScript type definitions for Iris URL classifier
 */

export type ContentType =
  | 'EVENT'
  | 'ARTICLE'
  | 'SERVICE'
  | 'PROJECT'
  | 'PUBLICATION'
  | 'PROGRAM'
  | 'COMMITTEE'
  | 'PLACE'
  | 'SPACE'
  | 'ATTRACTION'
  | 'COLLECTION'
  | 'FOCUS'
  | 'MEDIA'
  | 'GENERIC'
  | 'CATEGORY';

export interface ActionAPI {
  method: 'API';
  endpoint: string;
}

export interface ActionScrape {
  method: 'SCRAPE';
  reason: string;
}

export type Action = ActionAPI | ActionScrape;

export interface ClassificationMeta {
  canonical_url: string;
  matched_pattern: string;
  contains_type?: ContentType; // For CATEGORY type - indicates what items the list contains
}

export interface ClassificationResponse {
  action: Action;
  type: ContentType;
  meta: ClassificationMeta;
}

export interface ClassificationRequest {
  url: string;
}

export interface ErrorResponse {
  error: string;
}

/**
 * URL mapping configuration
 */
export interface UrlMapping {
  pattern: RegExp;
  type: ContentType;
  containsType?: ContentType; // For CATEGORY type mappings
  getEndpoint?: (match: RegExpMatchArray) => string;
  description: string;
}
