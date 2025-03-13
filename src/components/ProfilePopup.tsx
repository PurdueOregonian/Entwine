import Box from "@mui/material/Box";
import useProfileData from "../hooks/useProfileData";
import useStaticData from "../hooks/useStaticData";
import { Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

type ProfilePopupProps = {
    userId: string;
    onClose: () => void;
    position: { x: number; y: number };
}

const ProfilePopup = ({ userId, onClose, position }: ProfilePopupProps) => {
    const popupRef = useRef<HTMLDivElement>(null);
    const { username, age, gender, interests, loaded } = useProfileData(userId);
    const { interestMap } = useStaticData();
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            onClose();
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [onClose]);

    return (
        <Box
        ref={popupRef}
        className="profilePopupContent"
        style={{ top: position.y, left: position.x }}
        onClick={(e) => e.stopPropagation()}>
            {loaded && (
                <>
                    <a className="navLink font-semibold" onClick={() => navigate(`/Profile/${userId}`)}>
                        {username}
                    </a>
                    <Typography>Age: {age}</Typography>
                    <Typography>Gender: {gender}</Typography>
                    <Typography>Interests: {interests.map(interestId => interestMap.get(interestId)?.name ?? '').join(', ')}</Typography>
                </>)}
            {!loaded && <Typography>Loading...</Typography>}
        </Box>
    );
};

export default ProfilePopup;