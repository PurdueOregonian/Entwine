import { useLocation, useNavigate } from "react-router-dom";
import LogoutButton from "../Auth/LogoutButton";
import useAuth from "../hooks/useAuth";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Chat from "./Chat";
import { useState } from "react";
import { Tooltip } from "@mui/material";

const NavHeader = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const { auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            <div className="navbarTopRight">
                <div
                    className="navbarIcons cursor-pointer"
                    onClick={() => setIsChatOpen(!isChatOpen)}
                >
                    <Tooltip title="Open Chat">
                        <ChatBubbleOutlineIcon className="muiClickableButton" fontSize="large" />
                    </Tooltip>
                </div>
                <span>{`Logged in as ${auth.username}`}</span>
                <LogoutButton />
            </div>
            <div className="alignHorizontal topBar">
                <div className="siteTitle">Entwine</div>
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
            {isChatOpen && <Chat
                isOpen={isChatOpen}
                setIsOpen={setIsChatOpen}
            />}
        </>
    );
};

export default NavHeader;