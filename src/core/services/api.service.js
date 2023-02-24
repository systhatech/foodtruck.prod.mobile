import Axios from "axios";
import { base_url } from './config'
// import Loader from './loader'
const ApiService = Axios.create({
    baseURL: base_url
    // baseURL: "https://buglogic.sysstha.com/api/v1",
});
ApiService.interceptors.request.use(req => {
    let id_token = localStorage.getItem('id_token');
    let guest_token = localStorage.getItem('g_token');
    delete req.headers.Authorization;
    delete req.headers.common.Authorization;
    req.data = req.data ? req.data : {};
    if (id_token) {
        req.data.access_token = id_token;
    }
    if (guest_token) {
        req.data.guest = guest_token;
        req.data.guest_token = guest_token;
    }
    if(req.data instanceof FormData){
        req.headers['Content-Type'] ="multipart/form-data";
        if(localStorage.getItem('utype')){
            req.data.append("utype",localStorage.getItem('utype'));
        }
        req.data.append("access_token",id_token);
    }else{
        if(localStorage.getItem('utype')){
            req.data.utype = localStorage.getItem('utype');
        }
        req.headers['Content-Type'] ="application/x-www-form-urlencoded";
        req.data = Object.entries(req.data).map(e => e.map(encodeURIComponent).join('=')).join('&');
    }
    // delete req.headers.Authorization;
    return req; 
});

ApiService.interceptors.response.use(
    function(response) {
        return response.data;
    },
    function(error) {
        return Promise.reject(error);
    }
);

export { ApiService };
