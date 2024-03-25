import {Request, Response} from 'express';
import groupRepository from "../../src/repositories/groupRepository";
import GroupModel from "../../src/models/groupModel";
import {getAllGroups, addGroup, deleteGroup, updateGroup} from "../../src/controllers/groupsController";

jest.mock('../../src/repositories/groupRepository');

const mockRequest = (): Partial<Request> => {
    return { body: {}, params: {} };
};

const mockResponse = (): Partial<Response> & { status: jest.Mock; json: jest.Mock } => {
    let res:any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Partial<Response> & { status: jest.Mock; json: jest.Mock };
};


describe('Group Controller', () => {
    beforeEach(jest.clearAllMocks);

    describe('getAllGroups', () => {
        it('returns all groups', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const groups = [new GroupModel('Group 1', 'Description 1'), new GroupModel('Group 2', 'Description 2')];
            (groupRepository.getAll as jest.Mock).mockResolvedValue(groups);

            await getAllGroups(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ status: 'success', message: 'All groups', data: groups });
        });

        it('returns 500 if groupRepository.getAll throws an error', async () => {
            const req = mockRequest();
            const res = mockResponse();
            (groupRepository.getAll as jest.Mock).mockRejectedValue(new Error('Test error'));

            await getAllGroups(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Failed to get all groups', data: null, error: new Error('Test error') });
        });
    });

    describe('addGroup', () => {
        it('adds a group', async () => {
            const req = mockRequest();
            req.body = { name: 'Group 1', description: 'Description 1' };
            const res = mockResponse();
            const newGroup = new GroupModel('Group 1', 'Description 1');
            (groupRepository.addGroup as jest.Mock).mockResolvedValue([{ id: 1 }]);

            await addGroup(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ status: 'success', message: 'Group added successfully', data: new GroupModel('Group 1', 'Description 1', 1) });
        });

        it('returns 500 if groupRepository.addGroup throws an error', async () => {
            const req = mockRequest();
            const res = mockResponse();
            req.body = { name: 'Group 1', description: 'Description 1' };
            (groupRepository.addGroup as jest.Mock).mockRejectedValue(new Error('Test error'));

            await addGroup(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Failed to add the group', data: null, error: new Error('Test error') });
        });

        it('returns 400 if group data is invalid', async () => {
            const req = mockRequest();
            req.body = { name: '', description: 'Description 1' };
            const res = mockResponse();

            await addGroup(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Invalid group data provided' });
        });
    });

    describe('deleteGroup', () => {
        it('deletes a group', async () => {
            const req = mockRequest();
            req.params = { id: '1' };
            const res = mockResponse();
            (groupRepository.checkGroupExistsById as jest.Mock).mockResolvedValue(true);

            await deleteGroup(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ status: 'success', message: 'Group deleted successfully', data: 1 });
        });

        it('returns 500 if groupRepository.checkGroupExistsById throws an error', async () => {
            const req = mockRequest();
            req.params = { id: '1' };
            const res = mockResponse();
            (groupRepository.checkGroupExistsById as jest.Mock).mockRejectedValue(new Error('Test error'));

            await deleteGroup(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Failed to delete the group', data: null, error: new Error('Test error') });
        });

        it('returns 404 if group does not exist', async () => {
            const req = mockRequest();
            req.params = { id: '1' };
            const res = mockResponse();
            (groupRepository.checkGroupExistsById as jest.Mock).mockResolvedValue(false);

            await deleteGroup(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Group not found' });
        });
    });

    describe('updateGroup', () => {
        it('updates a group', async () => {
            const req = mockRequest();
            req.params = { id: '1' };
            req.body = { name: 'Group 1', description: 'Description 1' };
            const res = mockResponse();

            (groupRepository.checkGroupExistsById as jest.Mock).mockResolvedValue(new GroupModel('Group 1', 'Description 1'));
            (groupRepository.checkGroupExists as jest.Mock).mockResolvedValue(false);

            await updateGroup(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ status: 'success', message: 'Group updated successfully', data: new GroupModel('Group 1', 'Description 1', 1) });
        });

        it('returns 404 if group does not exist', async () => {
            const req = mockRequest();
            req.params = { id: '1' };
            req.body = { name: 'Group 1', description: 'Description 1' };
            const res = mockResponse();
            (groupRepository.checkGroupExistsById as jest.Mock).mockResolvedValue(false);

            await updateGroup(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Group not found' });
        });

        it('returns 400 if group name is empty', async () => {
            const req = mockRequest();
            req.params = { id: '1' };
            req.body = { name: '', description: 'Description 1' };
            const res = mockResponse();
            (groupRepository.checkGroupExistsById as jest.Mock).mockResolvedValue(new GroupModel('Group 1', 'Description 1'));

            await updateGroup(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Group name is empty' });
        });

        it('returns 400 if group name already exists', async () => {
            const req = mockRequest();
            req.params = { id: '1' };
            req.body = { name: 'Group 2', description: 'Description 1' };
            const res = mockResponse();
            (groupRepository.checkGroupExistsById as jest.Mock).mockResolvedValue(new GroupModel('Group 1', 'Description 1'));
            (groupRepository.checkGroupExists as jest.Mock).mockResolvedValue(true);

            await updateGroup(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Group name Group 2 already exists' });
        });

        it('returns 500 if groupRepository.updateGroup throws an error', async () => {
            const req = mockRequest();
            req.params = { id: '1' };
            req.body = { name: 'Group 1', description: 'Description 1' };
            const res = mockResponse();
            (groupRepository.checkGroupExistsById as jest.Mock).mockResolvedValue(new GroupModel('Group 1', 'Description 1'));
            (groupRepository.checkGroupExists as jest.Mock).mockResolvedValue(false);
            (groupRepository.updateGroup as jest.Mock).mockRejectedValue(new Error('Test error'));

            await updateGroup(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Failed to update the group', data: null, error: new Error('Test error') });
        });
    });
});