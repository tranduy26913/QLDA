import { createSlice } from "@reduxjs/toolkit";
export const authSlice = createSlice({
    name: "auth",
    initialState: {
        refreshToken: '',
        accessToken:''
    },
    reducers: {
       
        loginSuccess: (state, action) => {
            state.refreshToken = action.payload.refreshToken
            state.accessToken = action.payload.accessToken
            
        },
        logoutSuccess:(state)=>{
            state.refreshToken = ''
            state.accessToken = ''
        },

    }
})

export const {
    loginSuccess,
    logoutSuccess,
}=authSlice.actions

export default authSlice.reducer