import {Request, Response} from "express";
import apiDetailsRepository from "../repositories/apiDetailsRepository";
import ResponseModel from "../models/responseModel";
import {CustomRequest} from "../middleware";
import ApiDetailsModel from "../models/ApiDetailsModel";

const validatePath = async (req: CustomRequest, res: Response) => {

    const {path, method, query, params} = req.routeInfo || {
        path: '',
        method: '',
        query: {},
        params: {}
    };
    console.log(path)
    try{
        const apiId = await apiDetailsRepository.getApiDetailFromName(path);
        if (apiId === undefined) return res.status(404).json({error: 'API not found'});

        const apiDetail = await apiDetailsRepository.getApiDetailFromId(apiId);
        console.log(apiDetail[0].api_response_code);
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
            // Not a stringified JSON

        }
        return res.status(Number(apiResponse.api_Response_Code)).json(responseBody);
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ResponseModel('error', 'Failed to validate the path', null, String(error)));
    }

}

export default {validatePath}