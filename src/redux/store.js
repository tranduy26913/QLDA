import { configureStore,combineReducers } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import modalReducer from "./modalSlice"
import messageReducer from "./messageSlice"
import userReducer from "./userSlice"
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/es/storage'

const rootReducer=combineReducers({auth: authReducer,modal: modalReducer,message:messageReducer,user:userReducer})

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    blacklist: ['user'],
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export let persistor = persistStore(store)