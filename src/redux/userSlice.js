import { createSlice } from "@reduxjs/toolkit";
export const userSlice = createSlice({
    name: "user",
    initialState: {
        info: null
    },
    reducers: {
        setUserInfo: (state, action) => {
            state.info = action.payload
        },
        clearUserInfo: (state) => {
            state.info = null
        },
        updateBalance:(state,action)=>{
            state.info = {
                ...state.info,
                balance:action.payload
            } 
        }
    }
})

export const {
    setUserInfo,
    clearUserInfo,
    updateBalance
}=userSlice.actions

export default userSlice.reducer