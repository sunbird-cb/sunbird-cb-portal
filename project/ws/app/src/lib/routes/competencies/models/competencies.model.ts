export namespace NSCompetencie {
  export interface ICompetenciesJsonData {
    tabs: ICompetenciesTab[]
  }

  export interface ICompetenciesTab {
    name: string
    key: string
    badges: {
      enabled: boolean
      uri?: string
    }
    enabled: boolean
    routerLink: string
  }
  export interface ISearch {
    type: string
    field: string
    keyword: string
  }
  export interface ICompetencie {
    additionalProperties: { competencyType: string }
    competencyType?: string
    description: string
    id: string
    name: string
    source: null
    status: string
    competencySelfAttestedLevel?: string
    competencySelfAttestedLevelValue?: string
    competencySelfAttestedLevelName?: string
    type: string
    competencyCBPCompletionLevel?: string
    competencyCBPCompletionLevelName?: string
    competencyCBPCompletionLevelValue?: string
    children?: any[]
  }
  export interface IWebResponse {
    errorMessage: string
    statusCode: number
    statusMessage: string
  }
  export interface ICompetencieResponse {
    responseData: ICompetencie[]
    statusInfo: IWebResponse
  }

  export interface IWatCompetencieResponse {
    result: {
      data: ICompetencie[]
      message: string
      status: string
    }
  }

}
