import knex from "knex";
import config from "../../config/knexfile";

const db = knex(config.development);

const addResponseHeader = async (header_name: String, header_value: String, api_Id:Number) => {
    return db('response_headers').insert({header_name, header_value, api_Id});
}

const getResponseHeaders = async (api_Id: Number) => {
    return db('response_headers').where('api_Id', api_Id).first();
}

const deleteResponseHeader = async (header_id: Number) => {
    // Try to retrieve the header with the given ID
    const header = await db('response_headers').where('id', header_id).first();

    // If the header doesn't exist, throw an error
    if (!header) {
        throw new Error(`No header found with ID ${header_id}`);
    }

    // Delete the header
    return db('response_headers').where('id', header_id).del();
}

export default {addResponseHeader, getResponseHeaders, deleteResponseHeader};