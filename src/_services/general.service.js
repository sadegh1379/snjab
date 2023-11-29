import axios from 'axios';
import {userConstants} from "../_constants";
/*const axios2 = axios.create({
    baseURL: userConstants.SERVER_URL_2,
});*/
function get(url){
  /*  if(url.indexOf('v2/')>=0){
        return axios2.get(url);
    }*/
  return axios.get(url);
}
function post(url,params){
   /* if(url.indexOf('/v2/')>=0){
        return axios2.post(url, params);
    }*/
    return axios.post(url, params);
}
function put(url,params){
    // if(url.indexOf('/v2/')>=0){
    //     return axios2.put(url, params);
    // }
    return axios.put(url, params);
}
function _delete(url){
    // if(url.indexOf('/v2/')>=0){
    //     return axios2.delete(url);
    // }
    return axios.delete(url);
}
export const generalService = {
    get,
    post,
    put,
    delete: _delete
};


