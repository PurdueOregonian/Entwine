import axios from "../api/axios";
import { backendUrl } from "../constants/constants";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    const refresh = async () => {
        // TODO handle error (server down)?
        const response = await axios.post(`${backendUrl}/Auth/Refresh`,
            {},
            {
                withCredentials: true
            });
        setAuth(prev => {
            return { ...prev, username: response?.data?.username, token: response?.data?.accessToken, userId: response?.data?.userId }
        })
        return response?.data?.accessToken;
    }
    return refresh;
}

export default useRefreshToken;