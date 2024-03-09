import knex from 'knex';
import config from '../../config/knexfile';
import GroupModel from "../models/groupModel";
import groupModel from "../models/groupModel";

// Use the 'development' environment configuration
const db = knex(config.development);

const getAll = async () => {
    return db('groups').select('*');
}

const addGroup = async (group: GroupModel) => {
    return db('groups').insert(group);
}

const checkGroupExists = async (name: string) => {
    return db('groups').where('name', name).first();
}
const deleteGroup = async (name: string) => {
    return db('groups').where('name', name).del();
}

const getGroupId = async (groupName: string): Promise<number | null> => {
    const result = await db('groups').where('name', groupName).select('id');
    return result.length > 0 ? result[0].id : null;
};

const updateGroup = async (oldGroupName: string, updatedGroup: groupModel) => {
    const groupId: number | null = await getGroupId(oldGroupName);

    if (groupId !== null) {
        return db('groups').where('id', groupId).update(updatedGroup);
    } else {
        // Handle the case where the group with the given name doesn't exist
        console.error(`Group with name ${oldGroupName} not found.`);
        return null; // or throw an error, depending on your error-handling strategy
    }
};

export default {getAll, addGroup, checkGroupExists, deleteGroup, updateGroup, getGroupId};