export interface ITodayEvents {
    eventName: string,
    eventStartTime?: string
    eventEndTime?: string
    eventStartDate?: string
    eventCreatedOn?: string
    eventDuration?: string
    eventjoined?: string,
    eventThumbnail?: string
    pastevent?: boolean
    event?: IEventsDetails
  }

  export interface IEventsDetails {
    contentType?: string
    identifier?: string
    description?: string
    resourceType?: string
  }
