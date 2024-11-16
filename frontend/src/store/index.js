import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth'
import bookmarkReducer from './bookmark';

const store = configureStore({
    reducer: {
        auth:authReducer,
        bookmarks: bookmarkReducer,
    }
})

export default store