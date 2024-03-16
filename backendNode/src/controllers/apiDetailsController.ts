import apiDetailsRepository from "../repositories/apiDetailsRepository";
import ResponseModel from "../models/responseModel";
import {Request, Response} from 'express';
import ApiDetailsModel from "../models/ApiDetailsModel";
import responseHeadersRepository from "../repositories/responseHeadersRepository";
import logger from "../loggers";

const addApiDetails = async (req: Request, res: Response) => {
    try {
        const {apiName, groupId, apiMethod, apiResponseBody, apiResponseCode, apiResponseHeaders} = req.body;
        const newApiDetail: ApiDetailsModel = new ApiDetailsModel(apiName, groupId, apiMethod, apiResponseBody, apiResponseCode);
        if (!newApiDetail.isValid()) return res.status(400).json(new ResponseModel('error', 'Invalid API details data'));

        const apiDetailIdArray = await apiDetailsRepository.addApiDetail(newApiDetail);
        const apiDetailId = apiDetailIdArray[0].id;
        if (apiResponseHeaders) {
            for (const [key, value] of Object.entries(apiResponseHeaders)) {
                if (!key || !value) return res.status(400).json(new ResponseModel('error', 'Invalid response headers data'));
                try {
                    await responseHeadersRepository.addResponseHeader(key, String(value), apiDetailId);
                } catch (error) {
                    console.error(error);
                    return res.status(500).json(new ResponseModel('error', 'Failed to add the response headers', null, String(error)));
                }
            }

        }
        return res.status(201).json(new ResponseModel('success', 'API details added successfully'));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ResponseModel('error', 'Failed to add the API details', null, error));
    }
}

const getAllApiDetails = async (req: Request, res: Response) => {
    try {
        logger.info('Getting all API details')
        const apiDetails = await apiDetailsRepository.getAllApiDetails();
        let apiDetailsArray: ApiDetailsModel[] = [];
        for (const apiDetail of apiDetails) {

        }
        return res.status(200).json(new ResponseModel('success', 'All API details', apiDetails));
    } catch (error) {
        logger.error(error);
        return res.status(500).json(new ResponseModel('error', 'Failed to get all API details', null, error));
    }

}

const getApiDetailsfromId = async (req: Request, res: Response) => {
    const groupId: number = Number(req.query.groupId);
    const apiId: number = Number(req.query.apiId);
    if (!groupId && !apiId) return res.status(400).json(new ResponseModel('error', 'Invalid request'));
    try {
        let apiDetails;
        if (groupId) {
            apiDetails = await apiDetailsRepository.getApiDetails(groupId);
        } else {
            apiDetails = await apiDetailsRepository.getApiDetailFromId(apiId);
        }
        return res.status(200).json(new ResponseModel('success', 'API details', apiDetails));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ResponseModel('error', 'Failed to get the API details', null, error));
    }
}

const updateApiDetails = async (req: Request, res: Response) => {
    logger.info('Updating API details', req.body)
    try {
        const {id, apiName, groupId, apiMethod, apiResponseBody, apiResponseCode} = req.body;
        let responseBody = apiResponseBody;
        if (typeof apiResponseBody === 'object' && apiResponseBody !== null) {
            responseBody = JSON.stringify(apiResponseBody);
        }
        const apiDetail: ApiDetailsModel = new ApiDetailsModel(apiName, groupId, apiMethod, responseBody, apiResponseCode, id);
        if (!apiDetail.isValid()) {
            logger.error('Invalid API details data');
            return res.status(400).json(new ResponseModel('error', 'Invalid API details data'));
        }

        try {
            await apiDetailsRepository.checkApiDetailExists(id);
        } catch (error) {
            logger.error(error);
            return res.status(404).json(new ResponseModel('error', 'API details not found', null, String(error)));
        }
        try{
            await apiDetailsRepository.updateApiDetail(id, apiDetail);
            logger.info('API details updated successfully')
            return res.status(200).json(new ResponseModel('success', 'API details updated successfully', apiDetail));
        } catch (error) {
            logger.error(error);
            return res.status(400).json(new ResponseModel('error', 'Error in updating SQL', null, String(error)));
        }

    } catch (error) {
        logger.error(error);
        return res.status(500).json(new ResponseModel('error', 'Failed to update the API details', null, String(error)));
    }

}

const deleteApiDetails = async (req: Request, res: Response) => {
    try {
        const apiId: number = Number(req.params.id);
        if (!apiId) return res.status(400).json(new ResponseModel('error', 'Invalid request'));

        try {
            await apiDetailsRepository.checkApiDetailExists(apiId);
        } catch (error) {
            return res.status(404).json(new ResponseModel('error', 'API details not found', null, error));
        }

        await apiDetailsRepository.deleteApiDetail(apiId);
        return res.status(200).json(new ResponseModel('success', 'API details deleted successfully'));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ResponseModel('error', 'Failed to delete the API details', null, error));
    }

}

const addResponseHeaders = async (req: Request, res: Response) => {
    try {
        const {apiResponseHeaders, apiId} = req.body;
        if (!apiResponseHeaders || !apiId) return res.status(400).json(new ResponseModel('error', 'Invalid request'));

        try {
            await apiDetailsRepository.checkApiDetailExists(apiId);
        } catch (error) {
            return res.status(404).json(new ResponseModel('error', 'API details not found', null, error));
        }

        for (const [key, value] of Object.entries(apiResponseHeaders)) {
            if (!key || !value) return res.status(400).json(new ResponseModel('error', 'Invalid response headers data'));
            try {
                await responseHeadersRepository.addResponseHeader(key, String(value), apiId);
            } catch (error) {
                console.error(error);
                return res.status(500).json(new ResponseModel('error', 'Failed to add the response headers', null, error));
            }
        }
        return res.status(201).json(new ResponseModel('success', 'Response headers added successfully'));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ResponseModel('error', 'Failed to add the response header', null, error));
    }

}

const getResponseHeaders = async (req: Request, res: Response) => {
    try {
        const apiId: number = Number(req.params.apiId);
        if (!apiId) return res.status(400).json(new ResponseModel('error', 'Invalid request parameters for API id'));

        try {
            await apiDetailsRepository.checkApiDetailExists(apiId);
        } catch (error) {
            return res.status(404).json(new ResponseModel('error', 'API details not found', null, error));
        }

        const responseHeaders = await responseHeadersRepository.getResponseHeaders(apiId);
        return res.status(200).json(new ResponseModel('success', 'Response headers', responseHeaders));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ResponseModel('error', 'Failed to get the response headers', null, error));
    }
}

const deleteResponseHeaders = async (req: Request, res: Response) => {
    try {
        const headerId: number = Number(req.params.headerId);
        if (!headerId) return res.status(400).json(new ResponseModel('error', 'Invalid request parameters for header id'));

        await responseHeadersRepository.deleteResponseHeader(headerId);
        return res.status(200).json(new ResponseModel('success', `Response header with id ${headerId} deleted successfully`));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ResponseModel('error', 'Failed to delete the response header', null, String(error)));
    }

}

const updateResponseHeaders = async (req: Request, res: Response) => {
    const headerId: number = Number(req.params.headerId);
    try {
        const {headerName, headerValue} = req.body;
        if (!headerId || !headerName || !headerValue) return res.status(400).json(new ResponseModel('error', 'Invalid request'));

        await responseHeadersRepository.updateResponseHeader(headerId, headerName, headerValue);
        return res.status(200).json(new ResponseModel('success', `Response header with id ${headerId} updated successfully`));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ResponseModel('error', 'Failed to update the response header', null, String(error)));
    }


}


export {
    addApiDetails, getAllApiDetails, getApiDetailsfromId, updateApiDetails, deleteApiDetails, addResponseHeaders,
    getResponseHeaders, deleteResponseHeaders, updateResponseHeaders
};