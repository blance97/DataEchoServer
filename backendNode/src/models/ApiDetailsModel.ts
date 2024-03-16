class ApiDetailsModel {
    apiName: String;
    groupId: Number;
    apiMethod: String;
    apiResponseBody: String;
    apiResponseCode: String;
    id?: number;

    constructor(apiName: String, groupId: number, apiMethod: String, apiResponseBody: String, apiResponseCode: String, id?: number) {
        this.apiName = apiName;
        this.groupId = groupId;
        this.apiMethod = apiMethod;
        this.apiResponseBody = apiResponseBody;
        this.apiResponseCode = apiResponseCode;
        this.id = id;
    }
    isValid() {
        return this.apiName && this.groupId && this.apiMethod && this.apiResponseBody && this.apiResponseCode;
    }
}

export default ApiDetailsModel;