export interface IWidgetsPlayerPdfData {
  pdfUrl: string
  resumePage?: number
  identifier: string
  passThroughData?: any
  disableTelemetry?: boolean
  hideControls?: boolean
  readValuesQueryParamsKey?: {
    zoom: string;
    pageNumber: string;
  }
  collectionId?: string
  contentType?: string
  primaryCategory?: string
  version?: string
  mimeType?: any
}

export interface IPlayerPdf {
  pdfUrl: string
  resumePage?: number
  identifier?: string
  passThroughData?: any
  disableTelemetry?: boolean
  hideControls?: boolean
  readValuesQueryParamsKey?: {
    zoom: string;
    pageNumber: string;
  }
}
