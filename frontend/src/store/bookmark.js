import { createSlice } from '@reduxjs/toolkit';

const bookmarkSlice = createSlice({
    name: 'bookmarks',
    initialState: {
        bookmarks: [], // Stores the bookmarked content IDs
    },
    reducers: {
        setBookmarks: (state, action) => {
            state.bookmarks = action.payload; // Set bookmarks list
        },
        addBookmark: (state, action) => {
            // Add bookmark if not already present
            if (!state.bookmarks.includes(action.payload)) {
                state.bookmarks.push(action.payload);
            }
        },
        removeBookmark: (state, action) => {
            // Remove bookmark
            state.bookmarks = state.bookmarks.filter(
                (id) => id !== action.payload
            );
        },
    },
});

export const { setBookmarks, addBookmark, removeBookmark } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;
