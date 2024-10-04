import axiosPrivate from "../api/axios";
import { backendUrl } from "../constants/constants";
import useAuth from "./useAuth";

const useLogout = () => {
    const { setAuth } = useAuth();

    const logout = async () => {
        setAuth({});
        try {
            await axiosPrivate.post(`${backendUrl}/Auth/Logout`, {
                withCredentials: true
            });
        } catch (err) {
            console.error(err);
        }
    }

    return logout;
}

export default useLogout;