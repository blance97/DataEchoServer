import axios from "axios";
import { LoadJSONActionTypes, LOAD_JSON_DATA_SUCESS, ADD_HTTP_ENDPOINT_SUCESS } from "./actionTypes";
import { toast } from "react-toastify";


export function fetchTemplateFromApp(){
    return (dispatch:any) => {
        axios.get('/getJSON')
        .then((res) => { dispatch(loadJSONIntoAppSucess(res.data))})
        .catch((err) => {console.log("toast?", toast), 
                        toast.error(err)});
    }

}

export function loadJSONIntoAppSucess(jsonData: object):LoadJSONActionTypes {
    return {
        type: LOAD_JSON_DATA_SUCESS,
        payload: jsonData
    }
}

export function addHTTPEndpoint(HTTPEndpointDetails: any){
    return (dispatch:any) =>{
        axios.post('/addEndpoint', HTTPEndpointDetails)
        .then((res) => { dispatch(addHTTPEndpointSucess(res.data)) })
        .catch((err) => toast.error(`${err.response.data.Error}`));
    }
}

export function addHTTPEndpointSucess(HTTPEndpointDetails: any):LoadJSONActionTypes {
    return {
        type: ADD_HTTP_ENDPOINT_SUCESS,
        payload: HTTPEndpointDetails
    }
}


