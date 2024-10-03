import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    const refresh = async () => {
        // TODO handle error (server down)?
        const response = await axios.post('https://localhost:7253/Auth/Refresh',
            {},
            {
                withCredentials: true
            });
        setAuth(prev => {
            return { ...prev, token: response?.data?.accessToken }
        })
        return response?.data?.accessToken;
    }
    return refresh;
}

export default useRefreshToken;