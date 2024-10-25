import { useLocation, useNavigate } from "react-router-dom";
import LogoutButton from "../Auth/LogoutButton";
import useAuth from "../hooks/useAuth";

const NavHeader = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            <div className="user-info">
                <span>{`Logged in as ${auth.username}`}</span>
                <LogoutButton />
            </div>
            <div className="alignHorizontal topBar">
                <div className="siteTitle">Friends</div>
                <a className={`navLink ${isActive('/') ? 'activeNavBarLink' : ''}`} onClick={() => navigate('/')}>
                    Home
                </a>
                <a className={`navLink ${isActive('/Profile') ? 'activeNavBarLink' : ''}`} onClick={() => navigate('/Profile')}>
                    Profile
                </a>
                <a className={`navLink ${isActive('/Search') ? 'activeNavBarLink' : ''}`} onClick={() => navigate('/Search')}>
                    Search
                </a>
            </div>
        </>
    );
};

export default NavHeader;