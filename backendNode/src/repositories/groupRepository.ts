import knex from 'knex';
import config from '../../config/knexfile';
import GroupModel from "../models/groupModel";
import groupModel from "../models/groupModel";
import logger from "../loggers";

// Use the 'development' environment configuration
const db = knex(config.development);

db.raw('PRAGMA foreign_keys = ON;')
    .then(() => logger.info('Foreign key enforcement is enabled.'))
    .catch(err => logger.error('Failed to enable foreign key enforcement:', err));
const getAll = async () => {
    return db('groups').select('*');
}

const addGroup = async (group: GroupModel) => {
    return db('groups').insert(group).returning('id');
}

const checkGroupExists = async (name: string) => {
    return db('groups').where('name', name).first();
}
const deleteGroupByName = async (name: string) => {
    return db('groups').where('name', name).del();
}

const checkGroupExistsById = async (id: number) => {
    return db('groups').where('id', id).first();
}

const deleteGroupById = async (id: number) => {
    return db('groups').where('id', id).del();
}

const getGroupId = async (groupName: string): Promise<number | null> => {
    const result = await db('groups').where('name', groupName).select('id');
    return result.length > 0 ? result[0].id : null;
};

const updateGroup = async (groupId: Number, updatedGroup: groupModel) => {
    if (groupId !== null) {
        logger.info(`Updating group with id ${groupId}`);
        return db('groups').where('id', groupId).update(updatedGroup);
    } else {
        // Handle the case where the group with the given name doesn't exist
        logger.error(`Group with id ${groupId} not found`);
        return null; // or throw an error, depending on your error-handling strategy
    }
};

export default {
    getAll,
    addGroup,
    checkGroupExists,
    checkGroupExistsById,
    deleteGroupByName,
    deleteGroupById,
    updateGroup,
    getGroupId
};