export namespace NsAppRating {
    export interface IRating {
        activity_Id: string,
        userId: string,
        activity_type: string,
        rating: number,
        review: string,
    }

    export interface ILookupRequest {
        activity_Id: string,
        activity_Type: string,
        rating: number,
        limit: number,
        updateOn: string,
    }
}
