export interface IWidgetsPlayerOfflineSessionData {
  identifier: string
  disableTelemetry?: boolean
  collectionId?: string
  mimeType?: any
  contentType?: any
  courseName?: any
  progressStatus?: any
  content?: any
}

export interface IPlayerOfflineSession {
  identifier?: string
  disableTelemetry?: boolean
  hideControls?: boolean
  contentType?: any
}
