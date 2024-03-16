// controllers/groupController.ts
import {Request, Response} from 'express';
import ResponseModel from '../models/responseModel';
import groupRepository from '../repositories/groupRepository';
import GroupModel from "../models/groupModel";
import logger from "../loggers";

const getAllGroups = async (req: Request, res: Response) => {
    try {
        const groups = await groupRepository.getAll();
        return res.status(200).json(new ResponseModel('success', 'All groups', groups));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ResponseModel('error', 'Failed to get all groups', null, error));
    }
};

const addGroup = async (req: Request, res: Response) => {
    try {
        const {name, description} = req.body;
        logger.info('Adding a new group', {name, description})

        const newGroup: GroupModel = new GroupModel(name, description);
        if (!newGroup.isValid()) {
            logger.error('Invalid group data provided', {name, description});
            return res.status(400).json(new ResponseModel('error', 'Invalid group data provided'));
        }
        let groupId = await groupRepository.addGroup(newGroup);
        return res.status(201).json(new ResponseModel('success', 'Group added successfully', new GroupModel(name, description, groupId[0].id)));
    } catch (error) {
        logger.error(error);
        return res.status(500).json(new ResponseModel('error', 'Failed to add the group', null, error));
    }
}

const deleteGroup = async (req: Request, res: Response) => {
    logger.info(`Deleting group with id ${req.params.id}`);
    try {
        const {id} = req.params;
        const parsedId = Number(id)
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
        const {id} = req.params;
        const {name, description} = req.body;
        const parsedId = Number(id);

        logger.info(`Updating group with id ${parsedId}`);
        
        const groupExists = await groupRepository.checkGroupExistsById(parsedId);
        if (!groupExists) return res.status(404).json(new ResponseModel('error', 'Group not found'));
        console.log(name)
        if (!name || name === '') {
            logger.info(`New group name is empty`);
            return res.status(400).json(new ResponseModel('error', 'Group name is empty'));
        }
        const newGroupExists = await groupRepository.checkGroupExists(name);
        if (newGroupExists) return res.status(400).json(new ResponseModel('error', 'Group already exists'));

        await groupRepository.updateGroup(parsedId, new GroupModel(name, description));
        return res.status(200).json(new ResponseModel('success', 'Group updated successfully', new GroupModel(name, description, parsedId)));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ResponseModel('error', 'Failed to update the group', null, error));
    }
}

export {getAllGroups, addGroup, deleteGroup, updateGroup};
