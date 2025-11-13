import type { UrlMapping } from './types';

/**
 * URL pattern mappings for classification
 * 
 * Organization:
 * 1. API-enabled domains (whatson, news)
 * 2. Scrape-only domain (www.cityofsydney.nsw.gov.au)
 * 3. CATEGORY patterns (lists/collections)
 */

const API_BASE = 'https://cos-express-api.web.app';

export const urlMappings: UrlMapping[] = [
  // ============================================================================
  // WHATSON.CITYOFSYDNEY.NSW.GOV.AU - API-enabled
  // ============================================================================
  
  // EVENT - Individual events
  {
    pattern: /^https?:\/\/whatson\.cityofsydney\.nsw\.gov\.au\/events\/([^\/\?]+)/,
    type: 'EVENT',
    description: 'City of Sydney events from What\'s On portal',
    getEndpoint: (match) => `${API_BASE}/events/${match[1]}`,
  },

  // ARTICLE - Articles on What's On
  {
    pattern: /^https?:\/\/whatson\.cityofsydney\.nsw\.gov\.au\/articles\/([^\/\?]+)/,
    type: 'ARTICLE',
    description: 'What\'s On articles',
    getEndpoint: (match) => `${API_BASE}/articles/${match[1]}`,
  },

  // CATEGORY (EVENT) - Event listings with query parameters
  {
    pattern: /^https?:\/\/whatson\.cityofsydney\.nsw\.gov\.au\/.*\?.+/,
    type: 'CATEGORY',
    containsType: 'EVENT',
    description: 'What\'s On event listings with filters',
    getEndpoint: (match) => {
      const url = new URL(match[0]);
      return `${API_BASE}${url.pathname}${url.search}`;
    },
  },

  // CATEGORY (EVENT) - Event category pages
  {
    pattern: /^https?:\/\/whatson\.cityofsydney\.nsw\.gov\.au\/(venues|categories|programs|regions|suburbs)\/([^\/\?]+)/,
    type: 'CATEGORY',
    containsType: 'EVENT',
    description: 'What\'s On event category pages',
    getEndpoint: (match) => {
      const categoryType = match[1]; // venues, categories, programs, etc.
      const categoryValue = match[2]; // music, art, etc.
      return `${API_BASE}/whatson/v2/algolia-events/dynamic?&${categoryType}=${categoryValue}`;
    },
  },

  // ============================================================================
  // NEWS.CITYOFSYDNEY.NSW.GOV.AU - API-enabled
  // ============================================================================

  // ARTICLE - News articles
  {
    pattern: /^https?:\/\/news\.cityofsydney\.nsw\.gov\.au\/articles\/([^\/\?]+)/,
    type: 'ARTICLE',
    description: 'News articles',
    getEndpoint: (match) => `${API_BASE}/news/articles/${match[1]}`,
  },

  // ARTICLE - Media releases
  {
    pattern: /^https?:\/\/news\.cityofsydney\.nsw\.gov\.au\/media-releases\/([^\/\?]+)/,
    type: 'ARTICLE',
    description: 'News media releases',
    getEndpoint: (match) => `${API_BASE}/news/media-releases/${match[1]}`,
  },

  // CATEGORY (ARTICLE) - Media releases listing
  {
    pattern: /^https?:\/\/news\.cityofsydney\.nsw\.gov\.au\/media-releases\/?$/,
    type: 'CATEGORY',
    containsType: 'ARTICLE',
    description: 'News media releases listing',
    getEndpoint: () => `${API_BASE}/news/media-releases`,
  },

  // CATEGORY (ARTICLE) - News topics
  {
    pattern: /^https?:\/\/news\.cityofsydney\.nsw\.gov\.au\/topics\/([^\/\?]+)/,
    type: 'CATEGORY',
    containsType: 'ARTICLE',
    description: 'News topic pages',
    getEndpoint: (match) => `${API_BASE}/news/topics/${match[1]}`,
  },

  // CATEGORY (ARTICLE) - News tags
  {
    pattern: /^https?:\/\/news\.cityofsydney\.nsw\.gov\.au\/tags\/([^\/\?]+)/,
    type: 'CATEGORY',
    containsType: 'ARTICLE',
    description: 'News tag pages',
    getEndpoint: (match) => `${API_BASE}/news/tags/${match[1]}`,
  },

  // ============================================================================
  // WWW.CITYOFSYDNEY.NSW.GOV.AU - Scrape only
  // ============================================================================

  // SERVICE patterns
  {
    pattern: /^https?:\/\/www\.cityofsydney\.nsw\.gov\.au\/(building-certification|business-permits-approvals-and-tenders|childrens-services|construction-permits-and-approvals|development-applications|hoardings-and-temporary-structure-approvals|library-information-services|outdoor-events-filming|pet-and-animal-services|property-and-tree-maintenance|public-domain-works|rates|report-an-issue|sports-facility-booking-services|transport-and-parking|waste-and-recycling-services)\/([^\/]+)/,
    type: 'SERVICE',
    description: 'City services',
  },

  // PROJECT patterns
  {
    pattern: /^https?:\/\/www\.cityofsydney\.nsw\.gov\.au\/(building-and-facility-upgrades|building-new-infrastructure|consultations|improving-streets-and-public-spaces|nsw-government-projects|opportunities|park-and-playground-works|policy-and-planning-changes|proposed-works-and-maintenance|public-notices|vision-setting)\/([^\/]+)/,
    type: 'PROJECT',
    description: 'City projects',
  },

  // PUBLICATION patterns
  {
    pattern: /^https?:\/\/www\.cityofsydney\.nsw\.gov\.au\/(affordable-housing-contributions|case-studies|city-of-sydney-submissions|council-governance-and-administration|design-codes-and-technical-specifications|development-contributions|development-control-plans|development-guidelines-and-policies|floodplain-management-plans|guides|heritage-guidelines-and-studies|histories-local-parks-playgrounds|history|lists-maps-and-inventories|local-environmental-plans|meeting-minutes-and-terms-of-reference|policies|research-reports|strategic-land-use-plans|strategies-and-action-plans)\/([^\/]+)/,
    type: 'PUBLICATION',
    description: 'Publications and documents',
  },

  // PROGRAM patterns
  {
    pattern: /^https?:\/\/www\.cityofsydney\.nsw\.gov\.au\/(business-support-and-funding|community-activities-and-initiatives|community-support-and-funding|cultural-support-and-funding|environmental-support-and-funding|grants-and-sponsorship|public-health-and-safety-programs|sports-competitions|talks-courses-and-workshops|volunteer-programs)\/([^\/]+)/,
    type: 'PROGRAM',
    description: 'Programs and initiatives',
  },

  // COMMITTEE patterns
  {
    pattern: /^https?:\/\/www\.cityofsydney\.nsw\.gov\.au\/(advisory-panels|community-groups|international-student-ambassadors|networks-and-partners|public-juries)\/([^\/]+)/,
    type: 'COMMITTEE',
    description: 'Committees and groups',
  },

  // PLACE patterns
  {
    pattern: /^https?:\/\/www\.cityofsydney\.nsw\.gov\.au\/(community-centres|community-gardens|customer-service-centres|dog-off-leash-parks|gyms|landmarks|libraries|parks|playgrounds|pools|recycling-stations)\/([^\/]+)/,
    type: 'PLACE',
    description: 'Physical places and facilities',
  },

  // SPACE patterns
  {
    pattern: /^https?:\/\/www\.cityofsydney\.nsw\.gov\.au\/(hireable-indoor-spaces|hireable-outdoor-spaces|spaces-for-use|sports-facilities)\/([^\/]+)/,
    type: 'SPACE',
    description: 'Hireable spaces',
  },

  // ATTRACTION patterns
  {
    pattern: /^https?:\/\/www\.cityofsydney\.nsw\.gov\.au\/(artefacts|exhibitions|fountains-and-water-features|installations|monuments-and-memorials|murals-and-street-art|performances|sculptures|things-to-see-and-do)\/([^\/]+)/,
    type: 'ATTRACTION',
    description: 'Attractions and points of interest',
  },

  // COLLECTION patterns
  {
    pattern: /^https?:\/\/www\.cityofsydney\.nsw\.gov\.au\/(history-and-archive-collections|library-collections|walks-and-rides)\/([^\/]+)/,
    type: 'COLLECTION',
    description: 'Collections',
  },

  // FOCUS patterns
  {
    pattern: /^https?:\/\/www\.cityofsydney\.nsw\.gov\.au\/(built-environment|business-and-economy|culture-and-creativity|environmental-action|governance-and-decision-making|people-and-communities)\/([^\/]+)/,
    type: 'FOCUS',
    description: 'Strategic focus areas',
  },

  // ============================================================================
  // CATEGORY patterns for WWW.CITYOFSYDNEY.NSW.GOV.AU (base paths without slug)
  // ============================================================================

  // CATEGORY (SERVICE)
  {
    pattern: /^https?:\/\/www\.cityofsydney\.nsw\.gov\.au\/(building-certification|business-permits-approvals-and-tenders|childrens-services|construction-permits-and-approvals|development-applications|hoardings-and-temporary-structure-approvals|library-information-services|outdoor-events-filming|pet-and-animal-services|property-and-tree-maintenance|public-domain-works|rates|report-an-issue|sports-facility-booking-services|transport-and-parking|waste-and-recycling-services)\/?$/,
    type: 'CATEGORY',
    containsType: 'SERVICE',
    description: 'Service category listings',
  },

  // CATEGORY (PROJECT)
  {
    pattern: /^https?:\/\/www\.cityofsydney\.nsw\.gov\.au\/(building-and-facility-upgrades|building-new-infrastructure|consultations|improving-streets-and-public-spaces|nsw-government-projects|opportunities|park-and-playground-works|policy-and-planning-changes|proposed-works-and-maintenance|public-notices|vision-setting)\/?$/,
    type: 'CATEGORY',
    containsType: 'PROJECT',
    description: 'Project category listings',
  },

  // CATEGORY (PUBLICATION)
  {
    pattern: /^https?:\/\/www\.cityofsydney\.nsw\.gov\.au\/(affordable-housing-contributions|case-studies|city-of-sydney-submissions|council-governance-and-administration|design-codes-and-technical-specifications|development-contributions|development-control-plans|development-guidelines-and-policies|floodplain-management-plans|guides|heritage-guidelines-and-studies|histories-local-parks-playgrounds|history|lists-maps-and-inventories|local-environmental-plans|meeting-minutes-and-terms-of-reference|policies|research-reports|strategic-land-use-plans|strategies-and-action-plans)\/?$/,
    type: 'CATEGORY',
    containsType: 'PUBLICATION',
    description: 'Publication category listings',
  },

  // CATEGORY (PROGRAM)
  {
    pattern: /^https?:\/\/www\.cityofsydney\.nsw\.gov\.au\/(business-support-and-funding|community-activities-and-initiatives|community-support-and-funding|cultural-support-and-funding|environmental-support-and-funding|grants-and-sponsorship|public-health-and-safety-programs|sports-competitions|talks-courses-and-workshops|volunteer-programs)\/?$/,
    type: 'CATEGORY',
    containsType: 'PROGRAM',
    description: 'Program category listings',
  },

  // CATEGORY (COMMITTEE)
  {
    pattern: /^https?:\/\/www\.cityofsydney\.nsw\.gov\.au\/(advisory-panels|community-groups|international-student-ambassadors|networks-and-partners|public-juries)\/?$/,
    type: 'CATEGORY',
    containsType: 'COMMITTEE',
    description: 'Committee category listings',
  },

  // CATEGORY (PLACE)
  {
    pattern: /^https?:\/\/www\.cityofsydney\.nsw\.gov\.au\/(community-centres|community-gardens|customer-service-centres|dog-off-leash-parks|gyms|landmarks|libraries|parks|playgrounds|pools|recycling-stations)\/?$/,
    type: 'CATEGORY',
    containsType: 'PLACE',
    description: 'Place category listings',
  },

  // CATEGORY (SPACE)
  {
    pattern: /^https?:\/\/www\.cityofsydney\.nsw\.gov\.au\/(hireable-indoor-spaces|hireable-outdoor-spaces|spaces-for-use|sports-facilities)\/?$/,
    type: 'CATEGORY',
    containsType: 'SPACE',
    description: 'Space category listings',
  },

  // CATEGORY (ATTRACTION)
  {
    pattern: /^https?:\/\/www\.cityofsydney\.nsw\.gov\.au\/(artefacts|exhibitions|fountains-and-water-features|installations|monuments-and-memorials|murals-and-street-art|performances|sculptures|things-to-see-and-do)\/?$/,
    type: 'CATEGORY',
    containsType: 'ATTRACTION',
    description: 'Attraction category listings',
  },

  // CATEGORY (COLLECTION)
  {
    pattern: /^https?:\/\/www\.cityofsydney\.nsw\.gov\.au\/(history-and-archive-collections|library-collections|walks-and-rides)\/?$/,
    type: 'CATEGORY',
    containsType: 'COLLECTION',
    description: 'Collection category listings',
  },

  // CATEGORY (FOCUS)
  {
    pattern: /^https?:\/\/www\.cityofsydney\.nsw\.gov\.au\/(built-environment|business-and-economy|culture-and-creativity|environmental-action|governance-and-decision-making|people-and-communities)\/?$/,
    type: 'CATEGORY',
    containsType: 'FOCUS',
    description: 'Focus area category listings',
  },
];
