import knex from "knex";
import config from "../../config/knexfile";
import GroupModel from "../models/groupModel";
import ApiDetailsModel from "../models/ApiDetailsModel";
import groupRepository from "../repositories/groupRepository";
import apiDetailsRepository from "../repositories/apiDetailsRepository";

const db = knex(config.development);

async function fetchGroupsFromDatabase() {
    const groupsFromDatabase: GroupModel[] = await db('groups').select('*');
    return groupsFromDatabase;
}

async function fetchApiDetailsFromDatabase(groupName: string) {
    const groupId = await groupRepository.getGroupId(groupName);
    const apiDetailsFromDatabase: ApiDetailsModel[] = await db('api_details').where('group_id', groupId).select('*');
    return apiDetailsFromDatabase;
}

async function fetchResponseHeadersFromDatabase(apiName: string) {
    const apiId = await apiDetailsRepository.getApiDetailFromName(apiName);

    return db('response_headers').where('api_id', apiId).select('*');
}

async function convertToJSONFormat(groups: GroupModel[]) {
    return Promise.all(groups.map(async (group) => {
        const {name, description} = group;
        const apiDetails = await fetchApiDetailsFromDatabase(name);
        return {
            name,
            description,
            apiDetails: await Promise.all(apiDetails.map(async (apiDetail: any) => {
                const {api_name, api_method, api_response_body, api_response_code} = apiDetail;
                const responseHeaders = await fetchResponseHeadersFromDatabase(api_name);
                return {
                    api_name,
                    api_method,
                    api_response_body,
                    api_response_code,
                    responseHeaders,
                };
            })),
        };
    }));
}

const exportToJson = async () => {
    const groupsFromDatabase = await fetchGroupsFromDatabase();
    return await convertToJSONFormat(groupsFromDatabase)
}

export default {exportToJson}