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
        children: ITopic[]
        code: string
        description: string
        identifier: string
        index: number
        name: string
        noOfHoursConsumed: number
        status: string
    }
}
