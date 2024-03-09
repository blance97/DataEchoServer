class ApiDetailsModel {
    api_Name: String;
    group_id: Number;
    api_Method: String;
    api_Response_Body: String;
    api_Response_Code: String;

    constructor(apiName: String, groupId: number, apiMethod: String, apiResponseBody: String, apiResponseCode: String) {
        this.api_Name = apiName;
        this.group_id = groupId;
        this.api_Method = apiMethod;
        this.api_Response_Body = apiResponseBody;
        this.api_Response_Code = apiResponseCode;
    }
    isValid() {
        return this.api_Name && this.group_id && this.api_Method && this.api_Response_Body && this.api_Response_Code;
    }
}

export default ApiDetailsModel;