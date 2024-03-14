export namespace WsEvents {
  export interface IWsEventsFromWidget {
    type: 'widget'
    widgetType: string
    widgetSubType: string
  }
  export interface IWsEventsFromPage {
    type: 'page'
    pageUrl: string
    pageType: string
  }
  export enum WsEventType {
    Action = 'Action',
    Telemetry = 'Telemetry',
    PageNavigation = 'PageNavigation',
    AccessRestrictedContentAccessed = 'AccessRestrictedContentAccessed',
    PageSlow = 'PageSlow',
    ErrorOccurred = 'ErrorOccurred',
    WidgetResolveError = 'WidgetResolveError',
  }
  export enum WsEventLogLevel {
    Warn = 'Warn',
    Error = 'Error',
    Info = 'Info',
    Log = 'Log',
    Trace = 'Trace',
  }
   export enum WsAuditTypes {
     Created = 'Created',
     Updated = 'Updated',
     Deleted = 'Deleted',
   }
  export enum WsTimeSpentType {
    Page = 'Page',
    Player = 'Player',
  }
  export enum WsTimeSpentMode {
    Play = 'Play',
    View = 'View',
  }
  export enum externalTelemetrypdata {
    RBCP = 'rbcp-web-ui',
  }

  export interface IWsEvents<T> {
    eventType: WsEventType
    eventLogLevel: WsEventLogLevel
    from: IWsEventsFromWidget | IWsEventsFromPage | string
    to: string
    data: T
    passThroughData?: any
    pageContext?: any
  }

  export enum EnumTelemetrySubType {
    Init = 'Init',
    Interact = 'Interact',
    Loaded = 'Loaded',
    Unloaded = 'Unloaded',
    StateChange = 'StateChange',
    HeartBeat = 'HeartBeat',
    Search = 'Search',
    Feedback = 'Feedback',
    Impression = 'Impression',
    Chatbot = 'Chatbot',
    GetStarted = 'Get Started',
    PlatformRating = 'PlatformRating',
  }

  export interface ITelemetryPageContext {
    pageId?: string,
    module?: string,
    pageIdExt?: string
  }

  export interface ITelemetryEdata {
    type: string
    subType?: string
    id?: string
    pageid?: string
  }

  export interface ITelemetryTabData {
    label: string,
    index: number,
  }

  export interface IWsEventTelemetry {
    eventSubType: EnumTelemetrySubType
    pageContext?: ITelemetryPageContext
  }

  // PDF Telemetry Event
  export enum EnumTelemetryPdfActivity {
    PAGE_CHANGED = 'PAGE_CHANGED',
    FULLSCREEN_ACTIVATED = 'FULLSCREEN_ACTIVATED',
    FULLSCREEN_DEACTIVATED = 'FULLSCREEN_DEACTIVATED',
    ZOOM_CHANGE = 'ZOOM_CHANGE',
    NONE = 'NONE',
  }
  export interface IWsEventTelemetryPdfData extends IWsEventTelemetry {
    activityType: EnumTelemetryPdfActivity
    currentPage: number
    totalPage: number
    activityStartedAt: Date | null
    object: any
  }

  export interface IWsEventTelemetrySurveyData extends IWsEventTelemetry {
    object: any
  }
  export type WsEventTelemetryPDF = IWsEvents<IWsEventTelemetryPdfData>
  export type WsEventTelemetrySurvey = IWsEvents<IWsEventTelemetrySurveyData>

  // Interact Telemetry Event
  export interface IWsEventTelemetryInteract extends IWsEventTelemetry {
    edata: ITelemetryEdata
    object: any
    pageContext?: ITelemetryPageContext
  }

  export interface IWsEventTelemetryFeedback extends IWsEventTelemetry {
    edata: ITelemetryEdata
    object: any
    pageContext?: ITelemetryPageContext
  }

  export interface IWsEventTelemetryImpression extends IWsEventTelemetry {
    edata?: ITelemetryEdata
    object?: any
    pageContext?: ITelemetryPageContext
  }

  export interface IWsEventTelemetrySearch extends IWsEventTelemetry {
    type: string
    subType?: string
    query?: string
    filters?: string
    size?: number
    locale?: any
  }
  export interface IWsEventTelemetryHeartBeat extends IWsEventTelemetry {
    type: string
    // subType?: string
    // mode: string
    id: string
    // mimeType: string
  }
  export type WsEventTelemetryInteract = IWsEvents<IWsEventTelemetryInteract>
  export type WsEventTelemetryFeedback = IWsEvents<IWsEventTelemetryFeedback>
  export type WsEventTelemetryImpression = IWsEvents<IWsEventTelemetryImpression>
  export type WsEventTelemetrySearch = IWsEvents<IWsEventTelemetrySearch>
  export type WsEventTelemetryHeartBeat = IWsEvents<IWsEventTelemetryHeartBeat>

  // Multimedia Telemetry Data
  export enum EnumTelemetryMediaActivity {
    PLAYED = 'PLAYED',
    PAUSED = 'PAUSED',
    SEEKED = 'SEEKED',
    ENDED = 'ENDED',
    VOLUME_CHANGE = 'VOLUME_CHANGE',
    MUTE = 'MUTE',
    UNMUTE = 'UNMUTE',
    PLAYBACK_SPEED_CHANGE = 'PLAYBACK_SPEED_CHANGE',
    FULLSCREEN_ACTIVATED = 'FULLSCREEN_ACTIVATED',
    FULLSCREEN_DEACTIVATED = 'FULLSCREEN_DEACTIVATED',
    PICTURE_IN_PICTURE_ACTIVATED = 'PICTURE_IN_PICTURE_ACTIVATED',
    PICTURE_IN_PICTURE_DEACTIVATED = 'PICTURE_IN_PICTURE_DEACTIVATED',
    NONE = 'NONE',
  }
  export enum EnumTelemetryMediaState {
    PLAYING = 'PLAYING',
    PAUSED = 'PAUSED',
    ENDED = 'ENDED',
    BUFFERING = 'BUFFERING',
    NOT_STARTED = 'NOT_STARTED',
  }
  export interface IWsEventTelemetryMediaData extends IWsEventTelemetry {
    currentState: EnumTelemetryMediaState
    activityType: EnumTelemetryMediaActivity
    currentTime: number | null
    totalTime: number | null
    maxedSeekedTime: number
    activityStartedAt?: Date | null
  }
  export type WsEventTelemetryMedia = IWsEvents<IWsEventTelemetryMediaData>

  export enum EnumTelemetrymodules {
    CONTENT = 'content',
    FEEDBACK = 'feedback',
    COURSE = 'course',
    PROGRAM = 'program',
    EXPLORE = 'explore',
    LEARN = 'learn',
    HOME = 'home',
    DASHBOARD = 'dashboard',
    SEARCH = 'search',
    DISCUSS = 'Discuss',
    COMPETENCY = 'competency',
    EVENTS = 'events',
    CAREER = 'career',
    PROFILE = 'profile',
    NETWORK = 'network',
    SUPPORT = 'support',
    KARMAPOINTS = 'karmapoints',
    PLATFORM_RATING = 'platformrating',
  }
  export enum EnumInteractTypes {
    CLICK = 'click',
  }
  export enum EnumInteractSubTypes {
    COURSE_TAB = 'course-tab',
    CAREER_TAB = 'career-tab',
    NETWORK_TAB = 'network-tab',
    COMPETENCY_TAB = 'competency-tab',
    PROFILE_EDIT_TAB = 'profile-edit-tab',
    DISCUSS_TAB = 'discuss-tab',
    EVENTS_TAB = 'events-tab',
    SIDE_MENU = 'side-menu',
    HOME_PAGE_STRIP_TABS = 'home-page-strip-tabs',
    HUB_MENU = 'hub-menu',
    PORTAL_NUDGE = 'portal_nudge',
    CERTIFICATE = 'certificate',
  }
}
