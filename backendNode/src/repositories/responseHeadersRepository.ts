import knex from "knex";
import config from "../../config/knexfile";

const db = knex(config.development);

const addResponseHeader = async (headerName: String, headerValue: String, apiId: Number) => {
    return db('response_headers').insert({headerName, headerValue, apiId});
}

const getResponseHeaders = async (apiId: Number) => {
    return db('response_headers').select('headerName', 'headerValue').where('apiId', apiId);
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

const deleteResponseHeaders = async (apiId: Number) => {
    return db('response_headers').where('apiId', apiId).del();

}

const updateResponseHeader = async (header_id: Number, headerName: String, headerValue: String) => {
    // Try to retrieve the header with the given ID
    const header = await db('response_headers').where('id', header_id).first();

    // If the header doesn't exist, throw an error
    if (!header) {
        throw new Error(`No header found with ID ${header_id}`);
    }

    // Update the header
    return db('response_headers').where('id', header_id).update({headerName, headerValue});

}

export default {
    addResponseHeader,
    getResponseHeaders,
    deleteResponseHeader,
    deleteResponseHeaders,
    updateResponseHeader
};