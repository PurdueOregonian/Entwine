import { useContext } from "react"
import AuthContext from "../Login/AuthContext";

const useAuth = () => {
    return useContext(AuthContext);
}

export default useAuth;