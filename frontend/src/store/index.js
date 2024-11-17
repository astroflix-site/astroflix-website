import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth'
import bookmarkReducer from './bookmark';
import adminReducer from './admin'
const store = configureStore({
    reducer: {
        auth:authReducer,
        admin:adminReducer,
        bookmarks: bookmarkReducer,
    }
})

export default store