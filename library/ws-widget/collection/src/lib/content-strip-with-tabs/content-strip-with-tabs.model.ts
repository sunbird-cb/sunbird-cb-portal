import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { NSSearch } from '../_services/widget-search.model'
import { NsContent } from '../_services/widget-content.model'
import { NsCardContent } from '../card-content/card-content.model'

export namespace NsContentStripWithTabs {
  export interface IContentStripMultiple {
    errorWidget?: NsWidgetResolver.IRenderConfigWithAnyData
    loader?: boolean
    noDataWidget?: NsWidgetResolver.IRenderConfigWithAnyData
    strips: IContentStripUnit[]
    isChannelStrip?: boolean
  }
  export interface IContentStripUnit {
    disableTranslate?: any
    key: string
    title: string
    customeClass?: string
    stripTitleLink?: {
        link: string,
        icon: string
    }
    sliderConfig?: {
      showNavs: boolean,
      showDots: boolean,
      maxWidgets?: number
      cerificateCardMargin?: boolean
    },
    tabs?: NsContentStripWithTabs.IContentStripTab[] | undefined,
    titleDescription?: string
    name?: string
    mode?: 'accordion'
    info?: IStripInfo
    logo?: string
    preWidgets?: NsWidgetResolver.IRenderConfigWithAnyData[]
    postWidgets?: NsWidgetResolver.IRenderConfigWithAnyData[]
    stripConfig?: IStripConfig
    canHideStrip?: boolean
    filters?: any[]
    selectAll?: boolean | null
    request?: {
      search?: NSSearch.ISearchRequest
      searchV6?: NSSearch.ISearchV6Request
      enrollmentList?: any
      cbpList?: any
      searchRegionRecommendation?: NSSearch.ISearchOrgRegionRecommendationRequest
      api?: IStripRequestApi
      networkApi?: INetworkRequestApi
      ids?: string[]
      recommendedCourses?: any,
      masterCompetency?: any
      trendingSearch?: any
    }
    searchV6Type?: 'KB' | 'Collections' | 'searchQuery' | null
    stripBackground?: string
    noDataWidget?: NsWidgetResolver.IRenderConfigWithAnyData
    loader?: boolean
    loaderWidgets?: any
    errorWidget?: NsWidgetResolver.IRenderConfigWithAnyData
    refreshEvent?: Record<'eventType' | 'from', string>
    fetchLikes?: boolean
    secondaryHeading?: any
    viewMoreUrl?: {
      queryParams: string
      viewMoreText: string
      path: string
    }
    data?: []
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
  export interface INetworkRequestApi {
    path: string
    data?: any
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
    hideShowAll?: boolean
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

  export interface IContentStripTab {
    label: string,
    value: string,
    showTabDataCount: boolean,
    requestRequired?: boolean,
    computeDataOnClick?: boolean
    computeDataOnClickKey?: string
    request?: any,
    widgets?: NsWidgetResolver.IRenderConfigWithAnyData[]
    maxWidgets?: number,
    fetchTabStatus?: string
    nodataMsg?: string
    tabLoading?: boolean
  }
}
