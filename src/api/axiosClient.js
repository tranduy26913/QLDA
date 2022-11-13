
import axios from 'axios';
import queryString from 'query-string';
import jwt_decode from 'jwt-decode';
import getData from './getData';
import { toast } from 'react-toastify';
import { logoutSuccess } from '../redux/authSlice';
//const baseURL='https://thichtruyenchu.herokuapp.com/api'
const baseURL = 'http://localhost:5000/api'
//const baseURL = 'https://becnpmm.vercel.app/api'
export const axiosClient = axios.create({
    baseURL: baseURL,

    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true,
    paramsSerializer: (params) => queryString.stringify(params)
});


export const axiosClientWithToken = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true,
    paramsSerializer: (params) => queryString.stringify(params)
});
const refreshToken = async (user) => {
    const res = await axiosClient.post('/auth/refreshtoken', { refreshToken: user.refreshToken }, { headers: { Authorization: `Bearer ${user.accessToken}` }, })
    console.log(res)
    return res.data
}

var myInterceptor = null;
export const axiosInstance2 = (accessToken,refreshToken, dispatch, stateSuccess,stateFail) => {
    axiosClientWithToken.interceptors.request.eject(myInterceptor)
    myInterceptor = axiosClientWithToken.interceptors.request.use(
        async (config) => {
            let date = new Date();
            if(!(refreshToken)){
                return config;
            }
            const decodeToken = jwt_decode(accessToken);
            
            if (decodeToken.exp < date.getTime() / 1000) {
                try{
                    const response = getData(await refreshToken(refreshToken))

                    const newToken = {
                        accessToken: response.accessToken,
                        refreshToken: response.refreshToken
                    }
                    dispatch(stateSuccess(newToken))
                    config.headers['Authorization'] = `Bearer ${response.accessToken}`;
                }
                catch(err){
                    let msg = err?.response?.data?.details?.message || "Hết phiên đăng nhập"
                    toast.error(msg);
                    dispatch(stateFail())
                }
            }else{
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            return config;
        },
        err => {
            return Promise.reject(err)
        }
    );
}

export const axiosInstance = (user, dispatch, stateSuccess) => {
    const newInstance = axios.create({
        baseURL: baseURL,
        headers: {
            "Content-Type": "application/json"
        },
        paramsSerializer: (params) => queryString.stringify(params)
    });
    newInstance.interceptors.request.use(
        async (config) => {
            let date = new Date();
            const decodeToken = jwt_decode(user?.accessToken);
            if (decodeToken.exp < date.getTime() / 1000) {
                try {
                    const newAccessToken = getData(await refreshToken(user));
                    const newUser = {
                        ...user,
                        accessToken: newAccessToken.accessToken
                    }
                    dispatch(stateSuccess(newUser))
                    config.headers['Authorization'] = `Bearer ${newAccessToken.accessToken}`;
                } catch (error) {
                    let msg = error?.response?.data?.details?.message || "Hết phiên đăng nhập"
                    toast.error(msg);
                    dispatch(logoutSuccess())
                }

            } else {
                config.headers['Authorization'] = `Bearer ${user.accessToken}`;
            }

            return config;
        },
        err => {
            return Promise.reject(err)
        }
    );
    return newInstance;

}
