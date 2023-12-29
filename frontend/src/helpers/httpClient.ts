import axios from "axios";
import { loadAuth } from "./jwt.ts";

const HttpClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_HOST,
    transformResponse: (data) => JSON.parse(data),
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loadAuth()}`
    }
})

export default HttpClient;