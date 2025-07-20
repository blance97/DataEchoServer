import knex from "knex";
import config from "../../config/knexfile";
import ApiDetailsModel from "../models/ApiDetailsModel";
import logger from "../loggers";

const db = knex(config.development);
db.raw('PRAGMA foreign_keys = ON;')
    .then(() => logger.info('Foreign key enforcement is enabled.'))
    .catch(err => logger.error('Failed to enable foreign key enforcement:', err));

const addApiDetail = async (apiDetail: ApiDetailsModel) => {
    return db('api_details').insert(apiDetail).returning('id');
}

const getAllApiDetails = async () => {
    return db('api_details').select('*');
}

const getApiDetailsSpecific = async (apiName: string ,apiMethod: string, apiResponseCode: number) => {
    return db('api_details').select('*').where('api_name', apiName).andWhere('api_method', apiMethod).andWhere('api_response_code', apiResponseCode);

}

const getApiDetails = async (groupId: number) => {
    return db('api_details').where('group_id', groupId);
}

const getApiDetailFromId = async (apiId: number) => {
    return db('api_details').where('id', apiId);
}

const getApiIdDetailFromName = async (apiName: string) => {
    const apiDetail = await db('api_details').where('api_name', apiName);
    if (apiDetail.length === 0) throw new Error('API details not found');
    return apiDetail[0].id;

}

const updateApiDetail = async (apiId: number, apiDetail: ApiDetailsModel) => {
    return db('api_details').where('id', apiId).update(apiDetail);
}

const checkApiDetailExists = async (apiId: number) => {
    const apiDetail = await db('api_details').where('id', apiId);
    if (apiDetail.length === 0) throw new Error('API details not found');

}

const deleteApiDetail = async (apiId: number) => {
    return db('api_details').where('id', apiId).del();
}

export default {
    addApiDetail,
    getAllApiDetails,
    getApiDetailsSpecific,
    getApiDetails,
    getApiDetailFromId,
    getApiDetailFromName: getApiIdDetailFromName,
    updateApiDetail,
    checkApiDetailExists,
    deleteApiDetail
};