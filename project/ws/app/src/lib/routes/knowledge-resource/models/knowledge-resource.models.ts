export namespace NSKnowledgeResource {
    export interface IKnowledgeResourceJsonData {
        tabs: IKnowledgeResourceTab[]
      }

    export interface IKnowledgeResourceTab {
    name: string
    key: string
    badges: {
        enabled: boolean
        uri?: string
    }
    enabled: boolean
    routerLink: string
    }

    export interface IResourceData {
        additionalProperties: { files: [], krFiles: [], URL: [] }
        files?: IFiles[]
        krFiles?: IKrFiles[]
        URL?: IUrl[]
        name: string
        resourceId: any
        description: string
        url: string
        bookmark: boolean
        type: string
        source: string
        time: string
        fileType: string
    }

    export interface IFiles {
        url: string
    }

    export interface IUrl {
        url: string

    }

    export interface IKrFiles {
        name: string
        url: string
        fileType: string
    }

    export interface IWebResponse {
        errorMessage: string
        statusCode: number
        statusMessage: string
      }

    export interface IResourceResponse {
        responseData: IResourceData[]
        statusInfo: IWebResponse
      }

}
