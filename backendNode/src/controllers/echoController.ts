import {Request, Response} from "express";
import apiDetailsRepository from "../repositories/apiDetailsRepository";
import responseHeadersRepository from "../repositories/responseHeadersRepository";
import ResponseModel from "../models/responseModel";
import {CustomRequest} from "../middleware";
import ApiDetailsModel from "../models/ApiDetailsModel";
import {getResponseHeaders} from "./apiDetailsController";

const validatePath = async (req: CustomRequest, res: Response) => {

    const {path, method, query, params} = req.routeInfo || {
        path: '',
        method: '',
        query: {},
        params: {}
    };

    try {
        let apiId: number;
        try {
            apiId = await apiDetailsRepository.getApiDetailFromName(path);
        } catch (error) {
            console.error(error);
            return res.status(400).json(new ResponseModel('error', 'Failed to get the API details', null, String(error)));
        }

        console.log(apiId)
        if (apiId === 0) return res.status(404).json(new ResponseModel('error', 'API details not found'));

        const apiDetail = await apiDetailsRepository.getApiDetailFromId(apiId);
        const apiResponse: ApiDetailsModel = new ApiDetailsModel(
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

        const headers = await responseHeadersRepository.getResponseHeaders(apiDetail[0].id);
        console.log(headers);
        headers.forEach((header: any) => {
            res.setHeader(header.header_name, header.header_value);
        });
        console.log(res.getHeaders())
        return res.status(Number(apiResponse.api_Response_Code)).json(responseBody);
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ResponseModel('error', 'Failed to validate the path', null, String(error)));
    }

}

export default {validatePath}