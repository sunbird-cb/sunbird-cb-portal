export class SearchV4Request {
  request: RequestParams
  locale?: string[]
  constructor(competenciesKey: any) {
    this.request = new RequestParams(competenciesKey)
  }
}

export class RequestParams {
  filters: Filters
  fields: any[]
  facets: string[]
  query: string
  limit: number
  offset: number
  sort_by: SortBy
  exists?: string[]
  constructor(competenciesKey: any) {
    this.filters = new Filters()
    this.fields = [
      'downloadUrl',
      'organisation',
      'language',
      'source',
      'appIcon',
      'identifier',
      'name',
      'primaryCategory',
      'contentType',
      'posterImage',
      'createdOn',
      'duration',
      'avgRating',
      'additionalTags',
      'courseCategory',
      'mimeType',
      'contentId',
      'creatorLogo',
      'sectorDetails_v1',
      'languageMapV1',
      'language',
      'completionSurveyLink',
      'difficultyLevel'
    ]
    this.facets = [...SearchOthersFacet, ...competenciesKey]
    this.query = ''
    this.limit = 3
    this.offset = 0
    this.sort_by = new SortBy()
  }
}

export class Filters {
  contentType: any
  courseCategory?: any
  status: string[]
  sourceName?: string[]
  avgRating?: { [key: string]: string }
  language?: string[]
  organisation?: string[]
  sectorId?: string[]
  subSectorId?: string[]
  resourceType?: string[]
  [key: string]: any
  constructor() {
    this.contentType = ['Course']
    this.courseCategory = []
    this.status = ['Live']
  }
}

export class SortBy {
  createdOn?: string
  startDate?: string
  avgRating?: string
  firstName?: string
  name?: string
  constructor() {
    // this.lastUpdatedOn = 'desc';
  }
}

export enum SearchCategory {
  All = '',
  Courses = 'courses',
  Programs = 'programs',
  Events = 'events',
  People = 'peoples',
  CaseStudy = 'case-study',
  Communities = 'communities',
  Resources = 'resources',
  ExternalContents = 'external-contents',
}

export const SearchOthersFacet = [
  // 'duration',
  'avgRating',
  'language',
  'organisation',
  // 'sectorId',
  'courseCategory',
  'sectorDetails_v1.sectorName',
  'sectorDetails_v1.subSectorName',
]

// Events
export const SearchEventfacet = [
  'duration',
  'language',
  'sourceName',
  'startDateTimeInEpoch',
  'endDateTimeInEpoch',
  'resourceType',
]

export const SearchEventFields = [
  'name',
  'description',
  'identifier',
  'resourceType',
  'contentType',
  'sourceName',
  'duration',
  'startDate',
  'endDate',
  'startTime',
  'endTime',
  'createdOn',
  'eventType',
  'expiryDate',
  'appIcon',
  'startDateTime',
  'endDateTime',
]

export const SearchResourceMimeType = [
  'application/pdf',
  'video/mp4',
  'text/x-url',
  'audio/mpeg',
  'application/vnd.ekstep.content-collection',
]

export const SearchResourceFacets = [
  "resourceCategory",
  "sectorDetails_v1.subSectorName",
  "sectorDetails_v1.sectorName",
  "years"
]

export class SearchPeoplesRequest {
  filters: PeoplesFilters
  facets?: string[]
  fields: any[]
  limit: number
  offset: number
  sort_by: SortBy
  query: string
  constructor() {
    this.limit = 5
    this.offset = 0
    this.sort_by = {};
    (this.query = ''), (this.fields = [])
    this.filters = new PeoplesFilters()
    this.facets = [
      'profileDetails.professionalDetails.designation',
      'rootOrgName',
    ]
  }
}

export class PeoplesFilters {
  rootOrgName?: string[]
  [key: string]: any
}

export class SearchCommunitiesRequest {
  filterCriteriaMap: {
    status: string
    orgName?: string[]
    competencyArea?: string[]
    topicName?: string[];
    [key: string]: any
  }
  requestedFields: any[]
  pageNumber: number
  pageSize: number
  facets: string[]
  searchString?: string
  orderBy?: string
  orderDirection?: string

  constructor(competenciesKey: any) {
    this.filterCriteriaMap = {
      status: 'active',
    }
    this.requestedFields = []
    this.pageNumber = 0
    this.pageSize = 6
    this.facets = ['topicName', 'orgName', ...competenciesKey]
  }
}

export class SearchNLP {
  query: string
  synonyms: boolean
  constructor() {
    this.query = ''
    this.synonyms = false
  }
}

export interface PageChangeEmitter {
  currentPage: number
  previousPage: number
  limit: number
}

export type Facet = {
  name: string
  values: { name: string; count: number }[]
}

export type FormattedFacets = {
  [key: string]: { name: string; count: number }[] | null
}

export enum FacetType {
  Organization = 'organisation',
  Language = 'language',
  AvgRating = 'avgRating',
  Duration = 'duration',
  Designation = 'designation',
  SourceName = 'sourceName',
  courseCategory = 'courseCategory',
  sectorNames_v1 = 'sectorDetails_v1.sectorName',
  subSectorNames_v1 = 'sectorDetails_v1.subSectorName',
  sectorId = 'sectorId',
  resourceCategory = 'resourceCategory',
  subSectorId = 'subSectorId',
  subSectorNameResource = "subSectorName",
  sectorNameResource = "sectorName",
  contentPartners = 'contentPartner.contentPartnerName',
  topic = 'topic',
  topicName = 'topicName',
}

export enum SortType {
  MostRelevent = 'most_relevant',
  RecentlyAdded = 'recently_added_newest',
  HighestRated = 'highest_rated',
  MostEnrolled = 'most_enrolled',
  Ascending = 'asc',
  Descending = 'desc',
  AtoZ = 'a-z',
  ZtoA = 'z-a',
}

export enum SearchConstantLocalStorage {
  SortType = 'searchSortType',
}

export class SearchExternalRequest {
  filterCriteriaMap: {
    [key: string]: any
  }
  requestedFields: any[]
  pageNumber: number
  pageSize: number
  facets: string[]
  searchString: string | null
  orderBy?: string
  orderDirection?: string

  constructor(competenciesKey: any) {
    this.filterCriteriaMap = {}
    this.requestedFields = []
    this.pageNumber = 0
    this.pageSize = 3
    this.searchString = null
    this.facets = ['topic', 'contentPartner.contentPartnerName', ...competenciesKey]
    this.orderBy = 'createdOn'
  }
}

export const SearchResourcesFields = [
  'appIcon',
  'artifactUrl',
  'channel',
  'contentType',
  'createdOn',
  'creator',
  'description',
  'duration',
  'identifier',
  'mimeType',
  'name',
  'posterImage',
  'primaryCategory',
  'resourceType',
  'source',
  'additionalTags'
]
