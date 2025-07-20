class ApiDetailsModel {
    apiName: string;
    groupId: Number;
    apiMethod: string;
    apiResponseBodyType: string;
    apiResponseBody: string;
    apiResponseCode: Number;
    id?: number;
    apiResponseHeaders?: Array<{ key: string, value: string }>;

    constructor(apiName: string, groupId: number, apiMethod: string, apiResponseBodyType: string, apiResponseBody: string, apiResponseCode: String, id?: number, headers?: Array<{
        key: string,
        value: string
    }>) {
        this.apiName = apiName;
        this.groupId = groupId;
        this.apiMethod = apiMethod;
        this.apiResponseBodyType = apiResponseBodyType;
        this.apiResponseBody = apiResponseBody;
        this.apiResponseCode = Number(apiResponseCode);
        this.id = id;
        this.apiResponseHeaders = headers;
    }

    isValid() {
        return this.apiName && this.groupId && this.apiMethod && this.apiResponseBody && this.apiResponseCode && this.apiResponseBodyType;
    }
}

export default ApiDetailsModel;