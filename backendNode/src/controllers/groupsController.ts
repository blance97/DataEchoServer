// controllers/groupController.ts
import {Request, Response} from 'express';
import ResponseModel from '../models/responseModel';
import groupRepository from '../repositories/groupRepository';
import GroupModel from "../models/groupModel";

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

        const newGroup: GroupModel = new GroupModel(name, description);
        if (!newGroup.isValid()) return res.status(400).json(new ResponseModel('error', 'Invalid group data'));
        await groupRepository.addGroup(newGroup);
        return res.status(201).json(new ResponseModel('success', 'Group added successfully'));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ResponseModel('error', 'Failed to add the group', null, error));
    }
}

const deleteGroup = async (req: Request, res: Response) => {
    try {
        const {name} = req.params;
        const groupExists = await groupRepository.checkGroupExists(name);
        if (!groupExists) return res.status(404).json(new ResponseModel('error', 'Group not found'));

        await groupRepository.deleteGroup(name);
        return res.status(200).json(new ResponseModel('success', 'Group deleted successfully'));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ResponseModel('error', 'Failed to delete the group', null, error));
    }
}

const updateGroup = async (req: Request, res: Response) => {
    try {

        const {name} = req.params;
        const {newName, description} = req.body;
        let updatedName = newName;
        const groupExists = await groupRepository.checkGroupExists(name);
        if (!groupExists) return res.status(404).json(new ResponseModel('error', 'Group not found'));

        if(newName !== null && newName !== undefined && newName !== '') {
            const newGroupExists = await groupRepository.checkGroupExists(newName);
            if (newGroupExists) return res.status(400).json(new ResponseModel('error', 'Group with the new name already exists'));
        } else{
            updatedName = name;
        }

        await groupRepository.updateGroup(name, new GroupModel(updatedName, description));
        return res.status(200).json(new ResponseModel('success', 'Group updated successfully'));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ResponseModel('error', 'Failed to update the group', null, error));
    }

}

export {getAllGroups, addGroup, deleteGroup, updateGroup};
