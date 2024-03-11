import {Response} from "express";
import apiDetailsRepository from "../repositories/apiDetailsRepository";
import responseHeadersRepository from "../repositories/responseHeadersRepository";
import ResponseModel from "../models/responseModel";
import {CustomRequest} from "../middleware";
import ApiDetailsModel from "../models/ApiDetailsModel";

const validatePath = async (req: CustomRequest, res: Response) => {
    const {
        path = '', method = '', headers
    } = req.routeInfo || {};

    let DESResponseCode = null;
    for (let header in headers) {
        if (header.toLowerCase() === 'desresponsecode') {
            DESResponseCode = headers[header];
            break;
        }
    }
    if (!DESResponseCode) {
        return res.status(400).json(new ResponseModel('error', 'Invalid request need DESResponseCode header'));
    }

    try {
        const apiDetail = await apiDetailsRepository.getApiDetailsSpecific(path, method, Number(DESResponseCode));
        if (apiDetail.length === 0) return res.status(404).json(new ResponseModel('DES error', 'API details not found'));
        const apiResponse = new ApiDetailsModel(
            apiDetail[0].api_name,
            apiDetail[0].group_id,
            apiDetail[0].api_method,
            apiDetail[0].api_response_body,
            apiDetail[0].api_response_code
        );
        let responseBody = apiResponse.api_Response_Body;
        try {
            responseBody = JSON.parse(apiResponse.api_Response_Body as string);
        } catch (error) {
        } // Ignore the error

        const responseHeaders = await responseHeadersRepository.getResponseHeaders(apiDetail[0].id);
        responseHeaders.forEach((header: any) => res.setHeader(header.header_name, header.header_value));


        return res.status(Number(apiResponse.api_Response_Code)).json(responseBody);
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ResponseModel('DES error', 'Failed to validate the path', null, String(error)));
    }
}

export default {validatePath}