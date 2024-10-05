import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import useLogout from './hooks/useLogout';

const LogoutButton = () => {

    const logout = useLogout();
    const navigate = useNavigate();

    const signOut = () => {
        logout()
            .then(async () => {
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
        <button onClick={() => signOut()}>Log Out</button>
    );
}

export default LogoutButton;