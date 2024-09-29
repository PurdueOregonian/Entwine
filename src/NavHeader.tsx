import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import useAuth from "./hooks/useAuth";

const NavHeader = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    return (
        <>
            <div className="user-info">
                <span>{`Logged in as ${auth.username}`}</span>
                <LogoutButton />
            </div>
            <header className="App-header">
                <h1>Friends</h1>
            </header>
            <div className="Menu">
                <button onClick={() => navigate('/')}>Home</button>
                <button onClick={() => navigate('/CreateProfile')}>Create Profile</button>
            </div>
        </>)
}

export default NavHeader;