import apiDetailsRepository from "../repositories/apiDetailsRepository";
import ResponseModel from "../models/responseModel";
import {Request, Response} from 'express';
import ApiDetailsModel from "../models/ApiDetailsModel";
import responseHeadersRepository from "../repositories/responseHeadersRepository";
import HTTPResponseCodes from "../data/HTTPResponseCodes.json";
import logger from "../loggers";
import {getStringFromResponseBody} from "../utils/verifyAPIResponseBodyType";


const addApiDetails = async (req: Request, res: Response) => {
    logger.info('Adding API details')
    try {
        const {
            apiName,
            groupId,
            apiMethod,
            apiResponseBodyType,
            apiResponseBody,
            apiResponseCode,
            apiResponseHeaders
        } = req.body;
        const newApiDetail: ApiDetailsModel = new ApiDetailsModel(apiName, groupId, apiMethod, apiResponseBodyType, apiResponseBody, apiResponseCode);

        if (!newApiDetail.isValid()) {
            logger.error('Invalid API details data');
            return res.status(400).json(new ResponseModel('error', 'Invalid API details data', null, 'Invalid API details data'));
        }

        try {
            newApiDetail.apiResponseBody = getStringFromResponseBody(apiResponseBody, apiResponseBodyType);
        } catch (error) {
            logger.error(String(error));
            return res.status(400).json(new ResponseModel('error', String(error), null, error));
        }


        if (!(apiResponseCode in HTTPResponseCodes)) {
            logger.error('Invalid response code');
            return res.status(400).json(new ResponseModel('error', 'Invalid response code'));
        }

        //if response headers are not of type array return error
        if (apiResponseHeaders && !Array.isArray(apiResponseHeaders)) {
            logger.error('Invalid response headers data');
            return res.status(400).json(new ResponseModel('error', 'Invalid response headers data'));
        }

        for (const header of apiResponseHeaders) {
            const {headerName, headerValue} = header;
            if (!headerName || !headerValue) return res.status(400).json(new ResponseModel('error', 'Invalid response headers data'));
        }

        delete newApiDetail.apiResponseHeaders;

        const apiDetailIdArray = await apiDetailsRepository.addApiDetail(newApiDetail);
        const apiDetailId = apiDetailIdArray[0].id;

        if (apiResponseHeaders && apiResponseHeaders.length > 0) {

            logger.info('Adding response headers', apiResponseHeaders)
            try {
                await responseHeadersRepository.addResponseHeaders(apiResponseHeaders, apiDetailId);
            } catch (error) {
                logger.error(error);
                return res.status(500).json(new ResponseModel('error', 'Failed to add the response headers', null, error));
            }

        }
        newApiDetail.apiResponseHeaders = apiResponseHeaders;
        newApiDetail.id = apiDetailId;
        logger.info('API details added successfully')
        return res.status(201).json(new ResponseModel('success', 'API details added successfully', newApiDetail));


    } catch (error) {
        logger.error("Failed to add the API details", error);
        return res.status(500).json(new ResponseModel('error', 'Failed to add the API details', null, error));
    }
}

const getAllApiDetails = async (req: Request, res: Response) => {
    try {
        logger.info('Getting all API details')
        const apiDetails = await apiDetailsRepository.getAllApiDetails();
        let apiDetailsArray: ApiDetailsModel[] = [];
        for (const apiDetail of apiDetails) {
            const responseHeaders = await responseHeadersRepository.getResponseHeaders(apiDetail.id);
            apiDetailsArray.push(new ApiDetailsModel(apiDetail.apiName, apiDetail.groupId, apiDetail.apiMethod, apiDetail.apiResponseBodyType, apiDetail.apiResponseBody, apiDetail.apiResponseCode, apiDetail.id, responseHeaders));
        }
        return res.status(200).json(new ResponseModel('success', 'All API details', apiDetailsArray));
    } catch (error) {
        logger.error(error);
        return res.status(500).json(new ResponseModel('error', 'Failed to get all API details', null, error));
    }

}

const getApiDetailsfromId = async (req: Request, res: Response) => {
    const apiId: number = Number(req.query.apiId);
    if (!apiId) {
        logger.error('Invalid request group id or api id not found in the request query params');
        return res.status(400).json(new ResponseModel('error', 'Invalid request'));
    }
    try {
        const apiDetails: ApiDetailsModel = (await apiDetailsRepository.getApiDetailFromId(apiId))[0];
        const responseHeaders = await responseHeadersRepository.getResponseHeaders(apiId);
        const response = {
            apiDetails,
            responseHeaders
        }
        return res.status(200).json(new ResponseModel('success', 'API details', response));
    } catch (error) {
        logger.error(error);
        return res.status(500).json(new ResponseModel('error', 'Failed to get the API details', null, error));
    }
}

const updateApiDetails = async (req: Request, res: Response) => {
    logger.info('Updating API details', req.body)
    const {id, apiName, groupId, apiMethod, apiResponseBodyType, apiResponseBody, apiResponseCode} = req.body;

    const apiDetail: ApiDetailsModel = new ApiDetailsModel(apiName, groupId, apiMethod, apiResponseBodyType, apiResponseBody, apiResponseCode, id);
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

    if (!(apiResponseCode in HTTPResponseCodes)) {
        logger.error('Invalid response code');
        return res.status(400).json(new ResponseModel('error', 'Invalid response code'));
    }

    try {
        apiDetail.apiResponseBody = getStringFromResponseBody(apiResponseBody, apiResponseBodyType);
    } catch (error) {
        logger.error(String(error));
        return res.status(400).json(new ResponseModel('error', String(error), null, error));
    }


    //update response headers
    if (req.body.apiResponseHeaders) {
        const apiResponseHeaders = req.body.apiResponseHeaders;
        if (!Array.isArray(apiResponseHeaders)) {
            logger.error('Invalid response headers data');
            return res.status(400).json(new ResponseModel('error', 'Invalid response headers data'));
        }
        for (const header of apiResponseHeaders) {
            const {headerName, headerValue} = header;
            if (!headerName || !headerValue) {
                logger.error('Invalid response headers data');
                return res.status(400).json(new ResponseModel('error', 'Invalid response headers data'));
            }
        }
        try {
            await responseHeadersRepository.deleteResponseHeaders(id);
            for (const header of apiResponseHeaders) {
                const {headerName, headerValue} = header;
                await responseHeadersRepository.addResponseHeader(headerName, String(headerValue), id);
            }
        } catch (error) {
            logger.error(error);
            return res.status(500).json(new ResponseModel('error', 'Failed to update the response headers', null, String(error)));
        }
    }

    try {
        await apiDetailsRepository.updateApiDetail(id, apiDetail);
        apiDetail.apiResponseHeaders = req.body.apiResponseHeaders;
        logger.info('API details updated successfully')
        return res.status(200).json(new ResponseModel('success', 'API details updated successfully', apiDetail));
    } catch (error) {
        logger.error(error);
        return res.status(400).json(new ResponseModel('error', 'Error in updating SQL', null, String(error)));
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
        return res.status(200).json(new ResponseModel('success', 'API details deleted successfully', apiId));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ResponseModel('error', 'Failed to delete the API details', null, error));
    }

}

const addResponseHeaders = async (req: Request, res: Response) => {
    logger.info('Adding response headers', req.body)
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
            logger.error(error);
            return res.status(500).json(new ResponseModel('error', 'Failed to add the response headers', null, error));
        }
    }
    return res.status(201).json(new ResponseModel('success', 'Response headers added successfully'));
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
        logger.error(error);
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
        logger.error(error)
        return res.status(500).json(new ResponseModel('error', 'Failed to update the response header', null, String(error)));
    }
}


export {
    addApiDetails, getAllApiDetails, getApiDetailsfromId, updateApiDetails, deleteApiDetails, addResponseHeaders,
    getResponseHeaders, deleteResponseHeaders, updateResponseHeaders
};