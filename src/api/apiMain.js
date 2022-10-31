import { axiosClient, axiosInstance,axiosClientWithToken } from "./axiosClient";
import getData from './getData'
const apiMain = {

    ///authentication
    login: async (params) => {
        const res = await axiosClient.post('/auth/login', params)
        return res.data;
    },
    register: async (params) => {
        const res = await axiosClient.post('/auth/register', params)
        return res.data;
    },
    forgetPassword: async (params) => {
        const res = await axiosClient.post('/auth/forgetpassword', params)
        return getData(res);
    },
    reActive: async (params) => {
        const res = await axiosClient.post('/auth/reactive', params)
        return getData(res);
    },
    verifyToken: async (user, dispatch, stateSuccess) => {
        const url = `/auth/verifytoken`
        let axi = axiosInstance(user, dispatch, stateSuccess)
        return (await axi.get(url, { headers: { Authorization: `Bearer ${user.accessToken}` } })).data;
    },
    checkUsername:async (params) => {
        const res = await axiosClient.post('/auth/checkusername', params)
        return getData(res);
    },
    checkEmail:async (params) => {
        const res = await axiosClient.post('/auth/checkemail', params)
        return getData(res);
    },

    ///get data

    getStorys: async (params) => {
        const res = await axiosClient.get(`/novels`, { params: params });
        return getData(res);

    },
    getStorysByName: async (params) => {
        const res = await axiosClient.get(`/novels/search`, { params: params });
        return getData(res);

    },
    getStorysByUsername: async (params) => {
        const res = await axiosClientWithToken.get(`/novels/created`, { params });
        return getData(res);
    },
    getStory: async (params) => {
        const res = await axiosClient.get(`/novels/novel/${params.url}`);
        return getData(res);

    },
    getChapters: async (url, params) => {
        const res = await axiosClient.get(`/novels/novel/${url}/chuong`, { params: params });
        return getData(res);

    },
    getNameChapters: async (url, params) => {
        const res = await axiosClientWithToken.get(`/novels/novel/${url}/mucluc`,{ params});
        return getData(res);
    },
    getChapterByNumber: async (tentruyen, chapnum) => {
        return getData(await axiosClientWithToken.get(`/novels/novel/${tentruyen}/chuong/${chapnum}`));
    },
    
    createChapter: async (params) => {
        const url = `/novels/novel/chuong/create`
        return getData(await axiosClientWithToken.post(url, params));
    },
    updateChapter: async (params) => {
        const url = `/novels/novel/chuong/edit`
       
        return getData(await axiosClientWithToken.put(url, params));
    },

    deleteChapter: async (params) => {
        const url = `/novels/novel/chuong`
        return getData(await axiosClientWithToken.delete(url, { params }));
    },
    getReadings: async () => {
        const url = `/novels/readings`
        return getData(await axiosClientWithToken.get(url));
    },
    getReadingDefault: async (params) => {
        const url = `/novels/readingsdefault`
        return getData(await axiosClient.get(url, {params} ));
    },
    getSaveds: async () => {
        const url = `/saved`
        return getData(await axiosClientWithToken.get(url));
    },
    createStory: async (params) => {
        const url = `/novels/novel/create`
        return (await axiosClientWithToken.post(url, params)).data;
    },
    updateStory: async (params) => {
        const url = `/novels/novel/edit`
        return getData(await axiosClientWithToken.put(url, params));
    },
    deleteStory: async (params) => {
        const url = `/novels/novel`
        return getData(await axiosClientWithToken.delete(url, {params}));
    },
    getChapterNewUpdate: async (param) => {
        return getData(await axiosClient.get(`/novels/novel/newupdate`,{param}));
    },
    ///Comment

    createComment: async (params) => {
        const url = `/comment`
        return getData(await axiosClientWithToken.post(url, params));
    },
    getCommentsByUrl: async (url,params) => {
        return getData(await axiosClient.get(`/comment/${url}`,{params}));
    },
    deleteComment: async ( params) => {
        const url = `/comment/${params.id}`
        return getData(await axiosClientWithToken.delete(url));
    },

    ///user

    getAllUser: async (user, dispatch, stateSuccess) => {
        const url = 'admin/users'
        let axi = axiosInstance(user, dispatch, stateSuccess)
        return getData(await axi.get(url, { headers: { Authorization: `Bearer ${user.accessToken}` }, }));
    },

    refreshToken: async (user) => {
        const params = { refreshToken: user.refreshToken }
        const res = await axiosClient.post('/auth/refreshtoken', params, { headers: { Authorization: `Bearer ${user.accessToken}` }, })
        return res.data
    },

    getUserInfo: async (user, dispatch, stateSuccess) => {
        return (await axiosClientWithToken.get('/user/info')).data;
    },
    updateUserInfo: async ( params) => {
        return getData(await axiosClientWithToken.put('/user/info', params ));

    },

    ChangePassword: async (params) => {
        return getData(await axiosClientWithToken.put('/user/info/password', params));

    },
    activeAccount: async (params) => {
        const res = await axiosClient.get(`/auth/active`, { params: params });
        return res.data;
    },
    activeByAdmin: async (user, dispatch, stateSuccess, params) => {
        const axi = await axiosInstance(user, dispatch, stateSuccess)
        return getData(await axi.put(`admin/user/active`, params))
    },
    inactiveByAdmin: async (user, dispatch, stateSuccess, params) => {
        const axi = await axiosInstance(user, dispatch, stateSuccess)
        return getData(await axi.put(`admin/user/inactive`, params))
    },
    updateRole: async (user, dispatch, stateSuccess, params) => {
        const axi = await axiosInstance(user, dispatch, stateSuccess)
        return getData(await axi.put('admin/role/updatetouser', params));
    },
    deleteAccount: async (user, dispatch, stateSuccess, params) => {
        const axi = await axiosInstance(user, dispatch, stateSuccess)
        return getData(await axi.delete(`admin/user`, { headers: { Authorization: `Bearer ${user.accessToken}` },data:params }));
    },

    ///saved
    checkSaved: async ( params) => {
        return getData(await axiosClientWithToken.get(`/saved/${params.url}`));
    },
    savedStory: async (params) => {
        return getData(await axiosClientWithToken.post(`/saved/`, params));
    },
    unsavedStory: async ( params) => {
        return getData(await axiosClientWithToken.delete(`/saved`,{data:params }));
    },
}
export default apiMain;