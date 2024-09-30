import { useNavigate } from 'react-router-dom'
import useAuth from './hooks/useAuth';
import { axiosPrivate } from './api/axios';
import axios from 'axios';

const LogoutButton = () => {

    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const logout = () => {
        axiosPrivate.post(
            "https://localhost:7253/Auth/Logout",
            {},
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(() => {
                setAuth({
                    username: undefined,
                    password: undefined,
                    token: undefined
                })
                navigate('/Login');
            })
            .catch(error => {
                if (axios.isAxiosError(error)) {
                    // TODO actually handle the error
                    console.error('Error:', error.message);
                }
            });
    }

    return (
        <button onClick={() => logout()}>Log Out</button>
    );
}

export default LogoutButton;