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
        children: any[]
        code: string
        description: string
        identifier: string
        index: number
        name: string
        noOfHoursConsumed: number
        status: string
    }

    export interface ISearch {
        type: string
        field: string
        keyword: string
    }
    export interface IDesiredTopic {
        request: {
            userId: string
            profileDetails: {
                desiredTopics: string[]
            }

        }
    }
    export interface ISystemTopic {
        request: {
            userId: string
            profileDetails: {
                systemTopics: ISystemTopicChield[]
            }
        }
    }
    export interface ISystemTopicChield {
        identifier: string
        name: string
        children: []
    }
    export interface IRolesAndActivities {
        id: string
        name: string
        description: string
        activities: IRolesActivity[]
        // source: string
        // status: string
        // type: string
    }
    export interface IRolesActivity {
        description: string
        id: string
        name: string
        // parentRole: string
        // source: string
        // status: string
        // type: string
    }
    export interface IChipItems {
        name: string
      }
}
