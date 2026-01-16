export interface routesData {
  name: string
  navigationUrl: string
  routeId: string
  icon?: string
  imageUrl?: string
  queryParams?: any
  showUpdate?: boolean
}

export interface PageChangeEmitter {
  currentPage: number;
  previousPage: number;
  limit: number;
}

export interface tabDetails {
  lable: string;
  key: string;
  recordsCount: number;
}

export interface connectionUpdates {
  routeId: string;
  showUpdate: boolean;
}
