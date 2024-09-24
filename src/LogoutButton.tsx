import { Dispatch, SetStateAction} from "react";
import { useNavigate } from 'react-router-dom'

type LogoutButtonProps = {
    setLoggedInUser: Dispatch<SetStateAction<string | null>>;
}

const LogoutButton = ({ setLoggedInUser }: LogoutButtonProps) => {

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
                setLoggedInUser(null);
                localStorage.removeItem('username');
                navigate('/');
            });
    }

    return (
        <button onClick={() => logout()}>Log Out</button>
    );
}

export default LogoutButton;