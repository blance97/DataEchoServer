import { LoadJSONActionTypes, LOAD_JSON_DATA_SUCESS, ADD_HTTP_ENDPOINT_SUCESS } from "./actionTypes"

const initialState = {
    jsonData: {groups : {} as any}
}

interface endpointDetailsType{
    HTTPMethod: string,
    description: string,
    endpoint: string,
    groupName: string,
    responseBody: string,
    responseBodyType: string
}

export default function sideBar(state = initialState, action: LoadJSONActionTypes) {
    switch(action.type){
        
        case LOAD_JSON_DATA_SUCESS: {
            return {
                ...state, jsonData: action.payload
            }
        }

        case ADD_HTTP_ENDPOINT_SUCESS:
            const endpointDetails:any = action.payload;
            const groupName1: string = endpointDetails.groupName;

            return {
                ...state, 
                jsonData: {...state.jsonData, 
                    groups: {...state.jsonData.groups, 
                        [groupName1]: [ ...state.jsonData.groups[groupName1], endpointDetails]
                    }
                }
            }
        default: return state;
    }
}