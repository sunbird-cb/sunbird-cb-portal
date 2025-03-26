export namespace NsAppRating {
    export interface IRating {
        activityId: string,
        userId: string,
        activityType: string,
        rating: number,
        review: string,
        recommended: any
    }

    export interface ILookupRequest {
        activityId: string,
        activityType: string,
        rating?: number,
        limit: number,
        updateOn?: string,
    }
}
