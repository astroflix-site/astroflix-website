import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBookmark, removeBookmark } from "../../store/bookmark";
import { FaBookmark, FaRegBookmark } from 'react-icons/fa'; // Importing bookmark icons from react-icons

const BookmarkButton = ({ contentId }) => {
    const dispatch = useDispatch();
    const bookmarks = useSelector((state) => state.bookmarks.bookmarks);

    // Check if the content is bookmarked
    const isBookmarked = bookmarks.includes(contentId);

    // Function to handle bookmark/unbookmark
    const handleBookmark = async () => {
        if (isBookmarked) {
            // Remove from bookmarks (API call and Redux action)
            await fetch('/unbookmark', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contentId }),
            });
            dispatch(removeBookmark(contentId)); // Update Redux state
        } else {
            // Add to bookmarks (API call and Redux action)
            await fetch('/bookmark', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contentId }),
            });
            dispatch(addBookmark(contentId)); // Update Redux state
        }
    };

    return (
        <button
            onClick={handleBookmark}
            className={`px-4  py-2 rounded-lg text-white transition-all duration-200
                ${isBookmarked ? 'bg-slate-100 hover:bg-slate-300' : 'bg-neutral-500 hover:bg-neutral-900'}`}
        >
            {isBookmarked ? <FaBookmark /> : <FaRegBookmark />} {/* Using react-icons */}
        </button>
    );
};

export default BookmarkButton;