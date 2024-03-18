export default interface ApiDetailModel {
    id?: number;
    apiName: string;
    apiMethod: string;
    apiResponseBody: string;
    apiResponseCode: number;
    groupId: number;
    apiResponseHeaders?: Array<{ headerName: string, headerValue: string }>;
}