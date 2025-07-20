import { validatePath } from '../../src/controllers/echoController';
import { Request, Response } from 'express';
import apiDetailsRepository from '../../src/repositories/apiDetailsRepository';
import responseHeadersRepository from '../../src/repositories/responseHeadersRepository';
import websocketServer from '../../src/websocketServer';
import logger from '../../src/loggers';
import { convertStringToFormat } from '../../src/utils/verifyAPIResponseBodyType';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../../src/repositories/apiDetailsRepository');
jest.mock('../../src/repositories/responseHeadersRepository');
jest.mock('../../src/websocketServer');
jest.mock('../../src/loggers');
jest.mock('../../src/utils/verifyAPIResponseBodyType');
jest.mock('uuid');

interface CustomRequest extends Request {
    routeInfo?: {
        path: string;
        method: string;
        headers: Record<string, string>;
    };
}

describe('validatePath', () => {
    let req: Partial<CustomRequest>;
    let res: Partial<Response> & { setHeader: jest.Mock };
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        res = {
            status: statusMock,
            setHeader: jest.fn(),
        };
        req = {
            routeInfo: {
                path: '/test-path',
                method: 'GET',
                headers: { desresponsecode: '200' }
            },
        };
        jest.clearAllMocks();
    });

    it('returns 400 if DESResponseCode header is missing', async () => {
        req.routeInfo!.headers = {};
        await validatePath(req as any, res as any);
        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
            status: 'error',
            message: 'Invalid request need DESResponseCode header',
        }));
    });

    it('returns 404 if API details are not found', async () => {
        (apiDetailsRepository.getApiDetailsSpecific as jest.Mock).mockResolvedValue([]);
        await validatePath(req as any, res as any);
        expect(statusMock).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
            status: 'DES error',
            message: 'API details not found',
        }));
    });

    it('returns 500 if response body parsing fails', async () => {
        (apiDetailsRepository.getApiDetailsSpecific as jest.Mock).mockResolvedValue([{
            apiName: 'Test API',
            groupId: 1,
            apiMethod: 'GET',
            apiResponseBodyType: 'JSON',
            apiResponseBody: '{"invalidJson":}',
            apiResponseCode: 200,
        }]);
        (convertStringToFormat as jest.Mock).mockImplementation(() => {
            throw new Error('Parsing error');
        });
        await validatePath(req as any, res as any);
        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
            status: 'DES error',
            message: 'Failed to parse the response body',
        }));
    });

    it('returns the correct response for valid JSON response body', async () => {
        (apiDetailsRepository.getApiDetailsSpecific as jest.Mock).mockResolvedValue([{
            apiName: 'Test API',
            groupId: 1,
            apiMethod: 'GET',
            apiResponseBodyType: 'JSON',
            apiResponseBody: '{"key": "${DES_UUID4}"}',
            apiResponseCode: 200,
        }]);
        (responseHeadersRepository.getResponseHeaders as jest.Mock).mockResolvedValue([]);
        (uuidv4 as jest.Mock).mockReturnValue('generated-uuid');
        (convertStringToFormat as jest.Mock).mockImplementation((body) => JSON.parse(body));

        await validatePath(req as any, res as any);

        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({ key: 'generated-uuid' });
    });

    it('sets the correct content type header based on response body type', async () => {
        (apiDetailsRepository.getApiDetailsSpecific as jest.Mock).mockResolvedValue([{
            apiName: 'Test API',
            groupId: 1,
            apiMethod: 'GET',
            apiResponseBodyType: 'JSON',
            apiResponseBody: '{"key": "${DES_UUID4}"}',
            apiResponseCode: 200,
        }]);
        (responseHeadersRepository.getResponseHeaders as jest.Mock).mockResolvedValue([]);
        (uuidv4 as jest.Mock).mockReturnValue('generated-uuid');
        (convertStringToFormat as jest.Mock).mockImplementation((body) => body);

        await validatePath(req as any, res as any);

        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    });
});