import { environment } from 'src/environments/environment'
import { NsContent } from '../_services/widget-content.model'

export namespace NsCardContent {
  export interface ICard {
    content: NsContent.IContent
    cardSubType: TCardSubType
    context: { pageSection: string; position?: number }
    intranetMode?: 'greyOut' | 'hide'
    deletedMode?: 'greyOut' | 'hide'
    likes?: number
    contentTags?: IContentTags
    stateData: any
  }

  export interface IContentTags {
    daysSpan?: number
    excludeContentType?: NsContent.EContentTypes[]
    excludeMimeType?: string[]
    tag: string
    criteriaField?: string
  }

  export interface ICompetency extends ICard {
    competencyArea: ''
    competencyObject: {}
  }

  export type TCardSubType =
    | 'standard'
    | 'minimal'
    | 'space-saving'
    | 'card-user-details'
    | 'basic-info'
    | 'basic-details'
    | 'card-description-back'
    | 'network-card'

  export enum EContentStatus {
    LIVE = 'Live',
    EXPIRED = 'Expired',
    DELETED = 'Deleted',
    MARK_FOR_DELETION = 'MarkedForDeletion',
  }

  export enum ACBPConst {
    UPCOMING = 'upcoming',
    ALL = 'All',
    OVERDUE = 'overdue',
    SUCCESS = 'success',
  }

  export enum IGOTConst {
    COMPETENCIES = 'competencies_v6',
    RETIRED = 'Retired',
  }

  export const COMPENTENCYKEY = environment.compentencyVersionKey

}
