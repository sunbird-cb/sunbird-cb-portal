import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { NSSearch } from '../_services/widget-search.model'
import { NsContent } from '../_services/widget-content.model'
import { NsCardContent } from '../card-content/card-content.model'

export namespace NsContentStripMultiple {
  export interface IContentStripMultiple {
    errorWidget?: NsWidgetResolver.IRenderConfigWithAnyData
    loader?: boolean
    noDataWidget?: NsWidgetResolver.IRenderConfigWithAnyData
    strips: IContentStripUnit[]
    isChannelStrip?: boolean
  }
  export interface IContentStripUnit {
    key: string
    title: string
    name?: string
    mode?: 'accordion'
    info?: IStripInfo
    viewMoreUrl?: {
      queryParams?: string
      path?: string
      viewMoreText?: string
    }
    preWidgets?: NsWidgetResolver.IRenderConfigWithAnyData[]
    postWidgets?: NsWidgetResolver.IRenderConfigWithAnyData[]
    stripConfig?: IStripConfig
    canHideStrip?: boolean
    filters?: any[]
    selectAll?: boolean | null
    request?: {
      search?: NSSearch.ISearchRequest
      searchV6?: NSSearch.ISearchV6Request
      searchRegionRecommendation?: NSSearch.ISearchOrgRegionRecommendationRequest
      api?: IStripRequestApi
      ids?: string[]
      enrollmentList?: any
      comprelatedCbp?: any
      recommendedCourses?: any
      masterCompetency?: any
      mandatoryCourses?: any
      basedOnInterest?: any
      microsoftCourses?: any,
      DAKSHTACourses?: any,
      prarambhCourse?: any,
      curatedCollections?: any,
      blendedLearning?:any,
    }
    searchV6Type?: 'KB' | 'Collections' | 'searchQuery' | null
    stripBackground?: string
    noDataWidget?: NsWidgetResolver.IRenderConfigWithAnyData
    loader?: boolean
    errorWidget?: NsWidgetResolver.IRenderConfigWithAnyData
    refreshEvent?: Record<'eventType' | 'from', string>
    fetchLikes?: boolean
  }

  export interface IContentStripUnitV2 {
    key: string
    title: string
    name?: string
    mode?: 'accordion'
    info?: IStripInfo
    viewMoreUrl?: {
      queryParams?: string
      path?: string
    }
    preWidgets?: NsWidgetResolver.IRenderConfigWithAnyData[]
    postWidgets?: NsWidgetResolver.IRenderConfigWithAnyData[]
    stripConfig?: IStripConfig
    canHideStrip?: boolean
    filters?: any[]
    selectAll?: boolean | null
    request?: {
      search?: NSSearch.ISearchRequest
      searchV6?: NSSearch.ISearchV6RequestV2
      searchRegionRecommendation?: NSSearch.ISearchOrgRegionRecommendationRequest
      api?: IStripRequestApi
      ids?: string[]
      enrollmentList?: any
    }
    searchV6Type?: 'KB' | 'Collections' | 'searchQuery' | null
    stripBackground?: string
    noDataWidget?: NsWidgetResolver.IRenderConfigWithAnyData
    loader?: boolean
    errorWidget?: NsWidgetResolver.IRenderConfigWithAnyData
    refreshEvent?: Record<'eventType' | 'from', string>
    fetchLikes?: boolean
  }
  export interface IStripRequestApi {
    path: string
    queryParams?: {
      pageNo?: number
      pageSize?: number
      pageState?: string
      sourceFields?: string
    }
  }
  export interface IStripInfo {
    mode: 'below' | 'popup' | 'modal'
    visibilityMode?: 'hidden' | 'visible'
    icon: {
      icon: string
      scale: number
      style?: any // added for UI
    }
    widget: NsWidgetResolver.IRenderConfigWithAnyData
  }
  interface IStripConfig {
    // card subType key is used to determine the content Card display type
    cardSubType: NsCardContent.TCardSubType
    // to show view more card for a search strip
    postCardForSearch?: boolean
    intranetMode?: 'greyOut' | 'hide'
    deletedMode?: 'greyOut' | 'hide'
    contentTags?: IContentTags
  }

  export interface IContentTags {
    daysSpan?: number
    excludeContentType?: NsContent.EContentTypes[]
    excludeMimeType?: string[]
    tag: string
    criteriaField: string
  }
  export interface IContentStripResponseApi {
    contents: NsContent.IContent[]
    hasMore?: boolean
    pageState?: string
    totalHits?: number
  }
}
