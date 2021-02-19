export const LOAD_JSON_DATA_SUCESS = 'LOAD_JSON_DATA_SUCESS';
export const EXPORT_JSON_DATA = 'EXPORT_JSON_DATA';
export const ADD_HTTP_ENDPOINT_SUCESS = 'ADD_HTTP_ENDPOINT_SUCESS';

interface LoadJSONAction {
    type: typeof LOAD_JSON_DATA_SUCESS;
    payload: object;
}

interface exportJSONAction {
    type: typeof EXPORT_JSON_DATA;
    payload: object;
}

interface HTTPEndpointDetails {
    HTTPMethod: string;
    Endpoint: string;
    Description: string;
    Group: string;
    ReturnBody?: string;
    HTTPResponseHeaders?: object;
}

interface addHTTPEndpoint {
    type: typeof ADD_HTTP_ENDPOINT_SUCESS,
    payload: HTTPEndpointDetails
}

export type LoadJSONActionTypes = LoadJSONAction | exportJSONAction | addHTTPEndpoint