// controllers/groupController.ts
import {Request, Response} from 'express';
import ResponseModel from '../models/responseModel';
import groupRepository from "../repositories/groupRepository";
import GroupModel from "../models/groupModel";
import logger from "../loggers";

const getAllGroups = async (req: Request, res: Response) => {
    try {
        const groups = await groupRepository.getAll();
        return res.status(200).json(new ResponseModel('success', 'All groups', groups));
    } catch (error) {
        logger.error(error);
        return res.status(500).json(new ResponseModel('error', 'Failed to get all groups', null, error));
    }
};

const addGroup = async (req: Request, res: Response) => {
    try {
        const newGroup: GroupModel = new GroupModel(req.body.name, req.body.description);
        if (!newGroup.isValid()) {
            logger.error('Invalid group data provided', req.body);
            return res.status(400).json(new ResponseModel('error', 'Invalid group data provided'));
        }
        let groupId = await groupRepository.addGroup(newGroup);
        return res.status(201).json(new ResponseModel('success', 'Group added successfully', new GroupModel(req.body.name, req.body.description, groupId[0].id)));
    } catch (error) {
        logger.error(error);
        return res.status(500).json(new ResponseModel('error', 'Failed to add the group', null, error));
    }
}

const deleteGroup = async (req: Request, res: Response) => {
    try {
        const parsedId = Number(req.params.id)
        const groupExists = await groupRepository.checkGroupExistsById(parsedId);
        if (!groupExists) {
            logger.error("Group not found");
            return res.status(404).json(new ResponseModel('error', 'Group not found'));
        }
        await groupRepository.deleteGroupById(parsedId);
        return res.status(200).json(new ResponseModel('success', 'Group deleted successfully', parsedId));
    } catch (error) {
        logger.error(error);
        return res.status(500).json(new ResponseModel('error', 'Failed to delete the group', null, error));
    }

}

const updateGroup = async (req: Request, res: Response) => {
    try {
        const parsedId = Number(req.params.id);
        const groupExists = await groupRepository.checkGroupExistsById(parsedId);
        if (!groupExists) return res.status(404).json(new ResponseModel('error', 'Group not found'));
        if (!req.body.name || req.body.name === '') {
            logger.info(`New group name is empty`);
            return res.status(400).json(new ResponseModel('error', 'Group name is empty'));
        }
        if (groupExists.name !== req.body.name) {
            const newGroupNameExists = await groupRepository.checkGroupExists(req.body.name);
            if (newGroupNameExists) {
                logger.error(`Group name ${req.body.name} already exists`);
                return res.status(400).json(new ResponseModel('error', `Group name ${req.body.name} already exists`));
            }
        }
        await groupRepository.updateGroup(parsedId, new GroupModel(req.body.name, req.body.description));
        return res.status(200).json(new ResponseModel('success', 'Group updated successfully', new GroupModel(req.body.name, req.body.description, parsedId)));
    } catch (error) {
        logger.error(error);
        return res.status(500).json(new ResponseModel('error', 'Failed to update the group', null, error));
    }
}

export {getAllGroups, addGroup, deleteGroup, updateGroup};