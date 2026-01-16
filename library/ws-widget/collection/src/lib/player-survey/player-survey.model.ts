export interface IWidgetsPlayerSurveyData {
  surveyUrl: string
  identifier: string
  disableTelemetry?: boolean
  collectionId?: string
  mimeType?: any
  contentType?: any
  courseName?: any
  progressStatus?: any
  wfClientVersion?: string
}

export interface IPlayerSurvey {
  surveyUrl: string
  identifier?: string
  disableTelemetry?: boolean
  hideControls?: boolean
  contentType?: any
}
