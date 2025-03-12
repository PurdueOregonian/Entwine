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
            <div className="flex m-3 pb-3 items-center border-b-1 border-gray-300">
                <div className="text-4xl font-bold mr-8">Entwine</div>
                <a className={`navLink mr-4 ${isActive('/') ? 'activeNavBarLink' : ''}`} onClick={() => navigate('/')}>
                    Home
                </a>
                <a className={`navLink mr-4 ${isActive('/Profile') ? 'activeNavBarLink' : ''}`} onClick={() => navigate('/Profile')}>
                    Profile
                </a>
                <a className={`navLink mr-4 ${isActive('/Search') ? 'activeNavBarLink' : ''}`} onClick={() => navigate('/Search')}>
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