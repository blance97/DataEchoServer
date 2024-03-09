class ResponseModel {
    status: string;
    message: string;
    data?: any;
    error?: any;

    constructor(status: string, message: string, data?: any, error?: any) {
      this.status = status;
      this.message = message;
      this.data = data;
      this.error = error;
    }
  }

  export default ResponseModel;