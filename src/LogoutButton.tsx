import { useNavigate } from 'react-router-dom'
import useAuth from './hooks/useAuth';

const LogoutButton = () => {

    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const logout = () => {
        fetch("https://localhost:7253/Auth/Logout", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(() => {
                setAuth({
                    username: undefined,
                    password: undefined,
                    token: undefined
                })
                navigate('/Login');
            });
    }

    return (
        <button onClick={() => logout()}>Log Out</button>
    );
}

export default LogoutButton;