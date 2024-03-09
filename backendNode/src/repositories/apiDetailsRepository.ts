import knex from "knex";
import config from "../../config/knexfile";
import ApiDetailsModel from "../models/ApiDetailsModel";

const db = knex(config.development);

const addApiDetail = async (apiDetail: ApiDetailsModel) => {
    return db('api_details').insert(apiDetail).returning('id');
}

const getAllApiDetails = async () => {
    return db('api_details').select('*');
}

const getApiDetails = async (groupId: number) => {
    return db('api_details').where('group_id', groupId);
}

const getApiDetailFromId = async (apiId: number) => {
    return db('api_details').where('id', apiId);
}

const getApiDetailFromName = async (apiName: string) => {
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
    getApiDetails,
    getApiDetailFromId,
    getApiDetailFromName,
    updateApiDetail,
    checkApiDetailExists,
    deleteApiDetail
};