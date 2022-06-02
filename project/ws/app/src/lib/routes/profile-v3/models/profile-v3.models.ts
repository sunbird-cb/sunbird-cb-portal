export namespace NSProfileDataV3 {
    export interface IProfileJsonData {
        tabs: IProfileTab[]
    }

    export interface IProfileTab {
        name: string
        key: string
        badges: {
            enabled: boolean
            uri?: string
        }
        enabled: boolean
        routerLink: string
        step: number
        description: string
    }

    export interface ICompetencie {
        competencyType?: string
        description: string
        id: string
        name: string
        competencyLevel?: ICompetencyLevel[]
    }

    export interface ICompetencyLevel {
        name: string
    }


    export interface ITopic {
        id: string
        name: string
        subTopic?: ISubtopic[]
    }

    export interface ISubtopic {
        name: string
    }


}
