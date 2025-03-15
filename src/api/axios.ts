import axios from "axios";
import { backendUrl } from "../constants/constants";
const BASE_URL = backendUrl;

export default axios.create({
    baseURL: BASE_URL
})

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
})