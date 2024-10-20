import { useNavigate } from "react-router-dom";
import LogoutButton from "./Login/LogoutButton";
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
            <div className="alignHorizontal topBar">
                <div className="siteTitle">Friends</div>
                <a className="navLink" onClick={() => navigate('/')}>Home</a>
                <a className="navLink" onClick={() => navigate('/Profile')}>Profile</a>
            </div>
        </>)
}

export default NavHeader;