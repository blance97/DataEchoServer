import {Response} from "express";
import apiDetailsRepository from "../repositories/apiDetailsRepository";
import responseHeadersRepository from "../repositories/responseHeadersRepository";
import ResponseModel from "../models/responseModel";
import {CustomRequest} from "../middleware";
import ApiDetailsModel from "../models/ApiDetailsModel";
import websocketServer from "../websocketServer";
import logger from "../loggers";
import {convertStringToFormat} from "../utils/verifyAPIResponseBodyType";
import {v4 as uuidv4} from 'uuid';
import supportedFormats from "../data/SupportedHTTPResponseBodyFormats.json";


interface Message {
    requestPath: string;
    requestMethod: string;
    requestHeaders: any;
    responseCode: number;
    responseBody: string;
    timestamp: string;
}

const validatePath = async (req: CustomRequest, res: Response) => {

    console.log(req.routeInfo)
    const {
        path = '', method = '', headers
    } = req.routeInfo || {};

    logger.info('Incoming Request. Validating the path.')
    logger.info(`[${new Date().toTimeString().split(' ')[0]}] Req: ${method} ${path}`);

    let DESResponseCode = null;
    for (let header in headers) {
        if (header.toLowerCase() === 'desresponsecode') {
            DESResponseCode = headers[header];
            break;
        }
    }
    if (!DESResponseCode) {
        const consoleMessage: Message = {
            requestPath: path,
            requestMethod: method,
            requestHeaders: headers,
            responseCode: 400,
            responseBody: 'Invalid request need DESResponseCode header',
            timestamp: new Date().toTimeString().split(' ')[0]
        }
        logger.error('Invalid request need DESResponseCode header');
        websocketServer.sendMessages(JSON.stringify(consoleMessage));
        return res.status(400).json(new ResponseModel('error', 'Invalid request need DESResponseCode header'));
    }

    try {
        const apiDetail = await apiDetailsRepository.getApiDetailsSpecific(path, method, Number(DESResponseCode));
        if (apiDetail.length === 0) {
            const message = `[${new Date().toTimeString().split(' ')[0]}] Req: ${req.method} ${req.path} ${JSON.stringify(req.body)} Res: 404 API details not found`;
            logger.error('API details not found');
            websocketServer.sendMessages(message);
            return res.status(404).json(new ResponseModel('DES error', 'API details not found'));
        }

        const apiResponse = new ApiDetailsModel(
            apiDetail[0].apiName,
            apiDetail[0].groupId,
            apiDetail[0].apiMethod,
            apiDetail[0].apiResponseBodyType,
            apiDetail[0].apiResponseBody,
            apiDetail[0].apiResponseCode
        );

        setContentTypeHeader(res, apiResponse.apiResponseBodyType);

        let responseBody = apiResponse.apiResponseBody;
        try {//TODO add test cases for this
            if (supportedFormats.includes(apiResponse.apiResponseBodyType) && apiResponse.apiResponseBodyType === 'JSON') {
                responseBody = replaceWithUUID(responseBody);
            }
            responseBody = convertStringToFormat(responseBody, apiResponse.apiResponseBodyType);
        } catch (error) {
            logger.error('Failed to parse the response body', error);
            return res.status(500).json(new ResponseModel('DES error', 'Failed to parse the response body', null, String(error)));
        }

        const responseHeaders = await responseHeadersRepository.getResponseHeaders(apiDetail[0].id);

        responseHeaders.forEach((header: any) => res.setHeader(header.headerName, header.headerValue));

        const consoleMessage: Message = {
            requestPath: req.path,
            requestMethod: req.method,
            requestHeaders: req.headers,
            responseCode: Number(apiResponse.apiResponseCode),
            responseBody: apiResponse.apiResponseBody,
            timestamp: new Date().toTimeString().split(' ')[0]
        }
        websocketServer.sendMessages(consoleMessage);
        return res.status(Number(apiResponse.apiResponseCode)).json(responseBody);
    } catch (error) {
        logger.error('Failed to validate the path', error);
        return res.status(500).json(new ResponseModel('DES error', 'Failed to validate the path', null, String(error)));
    }
}

function parseDeepJson(obj: any): any {
    if (typeof obj === 'string') {
        try {
            const parsed = JSON.parse(obj);
            return parseDeepJson(parsed);
        } catch (e) {
            return obj;
        }
    }

    if (Array.isArray(obj)) {
        return obj.map(parseDeepJson);
    }

    if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            obj[key] = parseDeepJson(obj[key]);
        }
    }

    return obj;
}

function replaceWithUUID(json: any): any {
    json = parseDeepJson(json);

    for (let key in json) {
        if (typeof json[key] === 'object' && json[key] !== null) {
            if (Array.isArray(json[key])) {
                json[key] = json[key].map((item: any) => item === "${DES_UUID4}" ? uuidv4() : item);
            } else {
                json[key] = replaceWithUUID(json[key]);
            }
        } else if (json[key] === "${DES_UUID4}") {
            json[key] = uuidv4();
        }
    }

    return json; // do not JSON.stringify here unless you're responding with a raw string
}

function setContentTypeHeader(res: Response, apiResponseBodyType: string) {
    switch (apiResponseBodyType) {
        case 'JSON':
            res.setHeader('Content-Type', 'application/json');
            break;
        case 'XML':
            res.setHeader('Content-Type', 'application/xml');
            break;
        case 'HTML':
            res.setHeader('Content-Type', 'text/html');
            break;
        case 'Text':
            res.setHeader('Content-Type', 'text/plain');
            break;
        case 'CSV':
            res.setHeader('Content-Type', 'text/csv');
            break;
        case 'MessagePack':
            res.setHeader('Content-Type', 'application/x-msgpack');
            break;
        case 'YAML':
            res.setHeader('Content-Type', 'application/x-yaml');
            break;
        default:
            res.setHeader('Content-Type', 'application/octet-stream');
    }
}

export default {validatePath}