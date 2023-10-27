export namespace NsAppRating {
    export interface IRating {
        activityId: string,
        userId: string,
        activityType: string,
        rating: number,
        review: string,
        recommend: string
    }

    export interface ILookupRequest {
        activityId: string,
        activityType: string,
        rating?: number,
        limit: number,
        updateOn?: string,
    }
}
