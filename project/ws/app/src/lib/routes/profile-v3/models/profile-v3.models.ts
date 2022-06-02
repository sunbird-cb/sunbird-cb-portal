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


}
