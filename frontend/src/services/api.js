import axios from "axios";

// Assuming your backend is running locally on port 8000
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Crucial for sending/receiving refresh and access tokens
});