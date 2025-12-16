import axios from "axios";

const API_URL = "https://astro-flix.netlify.app/api";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export const login = async (email, password) => {
    try {
        const response = await api.post("/login", { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Login failed";
    }
};

export const register = async (username, email, password) => {
    try {
        const response = await api.post("/register", { username, email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Registration failed";
    }
};

export const logout = async () => {
    try {
        const response = await api.post("/logout");
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Logout failed";
    }
};

export const checkCookie = async () => {
    try {
        const response = await api.get("/check-cookie");
        return response.data.message; // Returns true or false
    } catch (error) {
        return false;
    }
};

export const getUserDetails = async () => {
    try {
        const response = await api.get("/user-details");
        return response.data.user;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch user details";
    }
};

export const getAllUsers = async () => {
    try {
        const response = await api.get("/users");
        return response.data.users;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch users";
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/delete-user/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to delete user";
    }
};

export const createSeries = async (data) => {
    try {
        const response = await api.post('/new-series', data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to create series";
    }
};

export const createEpisode = async (data) => {
    try {
        const response = await api.post('/new-episode', data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to create episode";
    }
};

export const getAllSeries = async () => {
    try {
        const response = await api.get('/all-series');
        if (response.data && Array.isArray(response.data.series)) {
            return response.data.series;
        }
        return [];
    } catch (error) {
        // If error, return empty array
        if (error.response?.status === 404) return [];
        console.error("getAllSeries error:", error);
        return [];
    }
};

export const getSeriesById = async (id) => {
    try {
        const response = await api.get(`/series/${id}`);
        return response.data.series;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch series details";
    }
};

export const addBookmark = async (contentId) => {
    try {
        const response = await api.post('/bookmark', { contentId });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to add bookmark";
    }
};

export const removeBookmark = async (contentId) => {
    try {
        const response = await api.post('/unbookmark', { contentId });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to remove bookmark";
    }
};

export const getBookmarks = async () => {
    try {
        const response = await api.get('/bookmarks');
        return response.data.bookmarks;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch bookmarks";
    }
};

export const searchSeries = async (query) => {
    try {
        const response = await api.get(`/search-series?title=${encodeURIComponent(query)}`);
        return response.data.series;
    } catch (error) {
        if (error.response?.status === 404) return [];
        throw error.response?.data?.message || "Failed to search series";
    }
};

export const getEpisodeById = async (id) => {
    try {
        const response = await api.get(`/episode/${id}`);
        return response.data.episode;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch episode";
    }
};

export const updateSeries = async (id, data) => {
    try {
        const response = await api.put(`/series/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to update series";
    }
};

export const deleteSeries = async (id) => {
    try {
        const response = await api.delete(`/series/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to delete series";
    }
};

export const updateEpisode = async (id, data) => {
    try {
        const response = await api.put(`/episode/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to update episode";
    }
};

export const deleteEpisode = async (id) => {
    try {
        const response = await api.delete(`/episode/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to delete episode";
    }
};

export default api;
