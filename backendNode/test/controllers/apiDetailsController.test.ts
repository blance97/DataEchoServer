import {
    addApiDetails,
    getAllApiDetails,
    getApiDetailsfromId,
    updateApiDetails,
    deleteApiDetails,
    addResponseHeaders, getResponseHeaders, deleteResponseHeaders, updateResponseHeaders
} from '../../src/controllers/apiDetailsController';
import { Request, Response } from 'express';
import apiDetailsRepository from '../../src/repositories/apiDetailsRepository'
import responseHeadersRepository from '../../src/repositories/responseHeadersRepository';

import mocked = jest.mocked;
import ApiDetailsModel from "../../src/models/ApiDetailsModel";
import HeaderModel from "../../src/models/headerModel";
import clearAllMocks = jest.clearAllMocks;

jest.mock('../../src/repositories/apiDetailsRepository');
jest.mock('../../src/repositories/responseHeadersRepository');

describe('API Details Controller', () => {
    let req: Request;
    let res: Response;
    let next: jest.Mock;
    let apiDetailsModel: ApiDetailsModel;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            query: {}
        } as Request;

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        next = jest.fn();
        clearAllMocks();
        apiDetailsModel = new ApiDetailsModel('apiName', 1, 'apiMethod', 'apiResponseBody', 'apiResponseCode');
    });

    afterEach(() => {
        mocked
        jest.clearAllMocks();
    });

    describe('addApiDetails', () => {
        it('should return 400 if API details data is invalid', async () => {
            mocked(apiDetailsRepository.addApiDetail).mockResolvedValue([{ id: 1 }]);
            req.body = {
                apiName: '',
                groupId: '',
                apiMethod: '',
                apiResponseBody: '',
                apiResponseCode: '',
                apiResponseHeaders: []
            };

            await addApiDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid API details data' }));
        });

        it('should return 400 if response code is invalid', async () => {
            req.body = {
                apiName: 'apiName',
                groupId: 1,
                apiMethod: 'apiMethod',
                apiResponseBody: 'apiResponseBody',
                apiResponseCode: -1,
                apiResponseHeaders: []
            };

            await addApiDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid response code' }));
        });

        it('should return 400 if response headers are not an array', async () => {
            req.body = {
                apiName: 'apiName',
                groupId: 'groupId',
                apiMethod: 'apiMethod',
                apiResponseBody: 'apiResponseBody',
                apiResponseCode: '200',
                apiResponseHeaders: 'invalidHeaders'
            };

            await addApiDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid response headers data' }));
        });

        it('should return 400 if response headers are invalid', async () => {
            req.body = {
                apiName: 'apiName',
                groupId: 'groupId',
                apiMethod: 'apiMethod',
                apiResponseBody: 'apiResponseBody',
                apiResponseCode: '200',
                apiResponseHeaders: [{ key: '', value: '' }]
            };

            await addApiDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid response headers data' }));
        });

        it('should return 500 if cannot add response headers', async () => {
            mocked(apiDetailsRepository.addApiDetail).mockResolvedValue([{ id: 1 }]);
            mocked(responseHeadersRepository.addResponseHeaders).mockRejectedValue(new Error('Test error'));
            const headers: HeaderModel[] = [{ headerName: 'key', headerValue: 'value' }];
            req.body = {
                apiName: 'apiName',
                groupId: 1,
                apiMethod: 'apiMethod',
                apiResponseBody: 'apiResponseBody',
                apiResponseCode: 200,
                apiResponseHeaders: headers
            };

            await addApiDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Failed to add the response headers' }));
        });

        it('should return 500 if cannot add API details', async () => {
            mocked(apiDetailsRepository.addApiDetail).mockRejectedValue(new Error('Test error'));
            req.body = {
                apiName: 'apiName',
                groupId: 'groupId',
                apiMethod: 'apiMethod',
                apiResponseBody: 'apiResponseBody',
                apiResponseCode: '200',
                apiResponseHeaders: []
            };

            await addApiDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Failed to add the API details' }));
        });

        it('should return 201 if API details are added successfully', async () => {
            mocked(apiDetailsRepository.addApiDetail).mockResolvedValue([{ id: 1 }]);
            req.body = {
                apiName: 'apiName',
                groupId: 'groupId',
                apiMethod: 'apiMethod',
                apiResponseBody: 'apiResponseBody',
                apiResponseCode: '200',
                apiResponseHeaders: []
            };

            await addApiDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'API details added successfully' }));
        });
    });

    describe('getAllApiDetails', () => {
        it('should return 200 with all API details', async () => {
            mocked(apiDetailsRepository.getAllApiDetails).mockResolvedValue([apiDetailsModel]);
            mocked(responseHeadersRepository.getResponseHeaders).mockResolvedValue([]);

            await getAllApiDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'All API details' }));
        });

        it('should return 500 if cannot get API details', async () => {
            mocked(apiDetailsRepository.getAllApiDetails).mockRejectedValue(new Error('Test error'));

            await getAllApiDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Failed to get all API details' }));
        });
    });

    describe('getApiDetailsfromId', () => {
        it('should return 400 if API id is invalid', async () => {
            req.query.apiId = '';

            await getApiDetailsfromId(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid request' }));
        });

        it('should return 200 with API details from ID', async () => {
            mocked(apiDetailsRepository.getApiDetailFromId).mockResolvedValue([apiDetailsModel]);
            mocked(responseHeadersRepository.getResponseHeaders).mockResolvedValue([]);
            req.query.apiId = '1';

            await getApiDetailsfromId(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'API details' }));
        });

        it('should return 500 if cannot get API details', async () => {
            mocked(apiDetailsRepository.getApiDetailFromId).mockRejectedValue(new Error('Test error'));
            req.query.apiId = '1';

            await getApiDetailsfromId(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Failed to get the API details' }));
        });
    });

    describe('updateApiDetails', () => {
        it('should return 400 if API details data is invalid', async () => {
            req.body = {
                id: 1,
                apiName: '',
                groupId: '',
                apiMethod: '',
                apiResponseBody: '',
                apiResponseCode: '',
                apiResponseHeaders: []
            };

            await updateApiDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({message: 'Invalid API details data'}));
        });

        it('should stringify the response body if its an object', async () => {
            mocked(apiDetailsRepository.updateApiDetail).mockResolvedValue(new Promise((resolve) => resolve(1)));
            req.body = {
                id: 1,
                apiName: 'apiName',
                groupId: 'groupId',
                apiMethod: 'apiMethod',
                apiResponseBody: {key: 'value'},
                apiResponseCode: '200',
                apiResponseHeaders: []
            };

            await updateApiDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({message: 'API details updated successfully'}));
        });

        it('should return 404 if API details are not found', async () => {
            mocked(apiDetailsRepository.updateApiDetail).mockResolvedValue(new Promise((resolve) => resolve(0)));
            mocked(apiDetailsRepository.checkApiDetailExists).mockRejectedValue(new Error('API details not found'));
            req.body = {
                id: 0,
                apiName: 'apiName',
                groupId: 'groupId',
                apiMethod: 'apiMethod',
                apiResponseBody: 'apiResponseBody',
                apiResponseCode: '200',
                apiResponseHeaders: []
            };

            await updateApiDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({message: 'API details not found'}));
        });

        it('should return 400 if response code is invalid', async () => {
            mocked(apiDetailsRepository.checkApiDetailExists).mockResolvedValue(undefined);
            req.body = {
                id: 1,
                apiName: 'apiName',
                groupId: 1,
                apiMethod: 'apiMethod',
                apiResponseBody: 'apiResponseBody',
                apiResponseCode: -1,
                apiResponseHeaders: []
            };

            await updateApiDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({message: 'Invalid response code'}));
        });

        it('should return 400 if response headers are not an array', async () => {
            req.body = {
                id: 1,
                apiName: 'apiName',
                groupId: 'groupId',
                apiMethod: 'apiMethod',
                apiResponseBody: 'apiResponseBody',
                apiResponseCode: '200',
                apiResponseHeaders: 'invalidHeaders'
            };

            await updateApiDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({message: 'Invalid response headers data'}));
        });

        it('should return 400 if response headers are invalid', async () => {
            req.body = {
                id: 1,
                apiName: 'apiName',
                groupId: 'groupId',
                apiMethod: 'apiMethod',
                apiResponseBody: 'apiResponseBody',
                apiResponseCode: '200',
                apiResponseHeaders: [{key: '', value: ''}]
            };

            await updateApiDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({message: 'Invalid response headers data'}));
        });

        it('should return 200 and call addResponseHeaders if response headers are provided', async () => {
            mocked(apiDetailsRepository.updateApiDetail).mockResolvedValue(new Promise((resolve) => resolve(1)));
            mocked(apiDetailsRepository.checkApiDetailExists).mockResolvedValue(undefined);
            mocked(responseHeadersRepository.addResponseHeaders).mockResolvedValue(new Promise((resolve) => resolve([1])));
            const headers: HeaderModel[] = [{headerName: 'key', headerValue: 'value'}];
            req.body = {
                id: 1,
                apiName: 'apiName',
                groupId: 'groupId',
                apiMethod: 'apiMethod',
                apiResponseBody: 'apiResponseBody',
                apiResponseCode: '200',
                apiResponseHeaders: headers
            };

            await updateApiDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({message: 'API details updated successfully'}));
        });

        it('should return 500 if cannot add response headers', async () => {
            mocked(apiDetailsRepository.updateApiDetail).mockResolvedValue(new Promise((resolve) => resolve(1)));
            mocked(apiDetailsRepository.checkApiDetailExists).mockResolvedValue(undefined);
            mocked(responseHeadersRepository.addResponseHeader).mockRejectedValue(new Error('Test error'));
            const headers: HeaderModel[] = [{headerName: 'key', headerValue: 'value'}];
            req.body = {
                id: 1,
                apiName: 'apiName',
                groupId: 1,
                apiMethod: 'apiMethod',
                apiResponseBody: 'apiResponseBody',
                apiResponseCode: 200,
                apiResponseHeaders: headers
            };

            await updateApiDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({message: 'Failed to update the response headers'}));
        });

        it('should return 400 updateApiDetail throws an error', async () => {
            mocked(apiDetailsRepository.updateApiDetail).mockRejectedValue(new Error('Test error'));
            req.body = {
                id: 1,
                apiName: 'apiName',
                groupId: 'groupId',
                apiMethod: 'apiMethod',
                apiResponseBody: 'apiResponseBody',
                apiResponseCode: '200',
                apiResponseHeaders: []
            };

            await updateApiDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({message: 'Error in updating SQL'}));
        });
    });
    describe('deleteApiDetails', () => {
        it('should return 400 if API id is invalid', async () => {
            req.params.id = '';

            await deleteApiDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid request' }));
        });

        it('should return 404 if API details are not found', async () => {
            mocked(apiDetailsRepository.checkApiDetailExists).mockRejectedValue(new Error('API details not found'));
            req.params.id = '1';

            await deleteApiDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'API details not found' }));
        });

        it('should return 200 if API details are deleted successfully', async () => {
            mocked(apiDetailsRepository.deleteApiDetail).mockResolvedValue(new Promise((resolve) => resolve(1)));
            mocked(apiDetailsRepository.checkApiDetailExists).mockResolvedValue(undefined);
            req.params.id = '1';

            await deleteApiDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'API details deleted successfully' }));
        });

        it('should return 500 if cannot delete API details', async () => {
            mocked(apiDetailsRepository.deleteApiDetail).mockRejectedValue(new Error('Test error'));
            req.params.id = '1';

            await deleteApiDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Failed to delete the API details' }));
        });
    });

    describe('addResponseHeaders', () => {
        it('should return 400 if response headers data is invalid', async () => {
            req.body = {
                apiId: '',
                headers: []
            };

            await addResponseHeaders(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid request' }));
        });

        it('should return 400 if response headers are invalid', async () => {
            req.body = {
                apiId: '1',
                headers: [{ key: '', value: '' }]
            };

            await addResponseHeaders(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid request' }));
        });

        it('should return 500 if cannot add response headers', async () => {
            req.body = {
                apiId: '1',
                apiResponseHeaders: [{ key: 'key', value: 'value' }]
            };

            mocked(responseHeadersRepository.addResponseHeader).mockRejectedValue(new Error('Test error'));
            await addResponseHeaders(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Failed to add the response headers' }));
        });

        it('should return 201 if response headers are added successfully', async () => {
            mocked(responseHeadersRepository.addResponseHeaders).mockResolvedValue([1]);
            mocked(responseHeadersRepository.addResponseHeader).mockResolvedValue([1]);
            req.body = {
                apiId: '1',
                apiResponseHeaders: [{ key: 'key', value: 'value' }]
            };

            await addResponseHeaders(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Response headers added successfully' }));
        });

        it('should return 404 if API details are not found for responseHeaders', async () => {
            mocked(apiDetailsRepository.checkApiDetailExists).mockRejectedValue(new Error('API details not found'));
            req.body = {
                apiId: '1',
                apiResponseHeaders: [{ key: 'key', value: 'value' }]
            };

            await addResponseHeaders(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'API details not found' }));
        });
    });
    describe('getResponseHeaders', () => {
        it('should return 400 if API id is invalid', async () => {
            req.query.apiId = '';

            await getResponseHeaders(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid request parameters for API id' }));
        });

        it('should return 200 with all response headers', async () => {
            mocked(responseHeadersRepository.getResponseHeaders).mockResolvedValue([{ headerName: 'key', headerValue: 'value' }]);
            mocked(apiDetailsRepository.checkApiDetailExists).mockResolvedValue(undefined);
            req.params.apiId = '1';

            await getResponseHeaders(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Response headers' }));
        });

        it('should return 500 if cannot get response headers', async () => {
            mocked(responseHeadersRepository.getResponseHeaders).mockRejectedValue(new Error('Test error'));
            req.params.apiId = '1';

            await getResponseHeaders(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Failed to get the response headers' }));
        });

        it('should return 404 if API details are not found for responseHeaders', async () => {
            mocked(apiDetailsRepository.checkApiDetailExists).mockRejectedValue(new Error('API details not found'));
            req.params.apiId = '1';

            await getResponseHeaders(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'API details not found' }));
        });
    });

    describe('deleteResponseHeaders', () => {
        it('should return 400 if API id is invalid', async () => {
            req.params.headerId = '';

            await deleteResponseHeaders(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid request parameters for header id' }));
        });


        it('should return 200 if response headers are deleted successfully', async () => {
            mocked(apiDetailsRepository.checkApiDetailExists).mockResolvedValue(undefined);
            mocked(responseHeadersRepository.deleteResponseHeaders).mockResolvedValue(new Promise((resolve) => resolve(1)));
            req.params.headerId = '1';

            await deleteResponseHeaders(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Response header with id 1 deleted successfully' }));
        });

        it('should return 500 if cannot delete response headers', async () => {
            mocked(responseHeadersRepository.deleteResponseHeader).mockRejectedValue(new Error('Test error'));
            req.params.headerId = '1';

            await deleteResponseHeaders(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Failed to delete the response header' }));
        });
    });

    describe('updateResponseHeaders', () => {
        it('should return 400 if response headers data is invalid', async () => {
            req.params.headerId = '1';
            req.body = {
                headerName: '',
                headerValue: ''
            };

            await updateResponseHeaders(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid request' }));
        });

        it('should return 500 if cannot update response headers', async () => {
            req.params.headerId = '1';
            req.body = {
                headerName: 'key',
                headerValue: 'value'
            };

            mocked(responseHeadersRepository.updateResponseHeader).mockRejectedValue(new Error('Test error'));
            await updateResponseHeaders(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Failed to update the response header' }));
        });

        it('should return 200 if response headers are updated successfully', async () => {
            mocked(responseHeadersRepository.updateResponseHeader).mockResolvedValue(new Promise((resolve) => resolve(1)));
            req.params.headerId = '1';
            req.body = {
                headerName: 'key',
                headerValue: 'value'
            };

            await updateResponseHeaders(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Response header with id 1 updated successfully' }));
        });
    });
});