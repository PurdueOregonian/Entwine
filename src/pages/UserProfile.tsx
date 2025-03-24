import { Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import useStaticData from "../hooks/useStaticData";
import useProfileData from "../hooks/useProfileData";

function UserProfile() {
    const { userIdFromRoute } = useParams();
    const userId = userIdFromRoute;
    const { interestMap } = useStaticData();

    const { profileData } = useProfileData(userId);

    return (
        <>
            {profileData &&
                <div className="center">
                    <Typography variant="h4">{profileData.username}</Typography>
                    <div className="flex center gap-2.5">
                        <Typography>Age</Typography>
                        <Typography>{profileData.age}</Typography>
                    </div>
                    <div className="flex center gap-2.5">
                        <Typography>Gender</Typography>
                        <Typography>{profileData.gender}</Typography>
                    </div>
                    <div className="flex center gap-2.5">
                        <Typography>Interests</Typography>
                        <Typography>{profileData.interests.map(interestId => interestMap.get(interestId)?.name ?? '').join(', ')}</Typography>
                    </div>
                    <div className="flex center gap-2.5">
                        <Typography>Location</Typography>
                        {profileData.location &&
                            <Typography>{profileData.location.city}, {profileData.location.state ?? profileData.location.country}</Typography>
                        }
                    </div>
                </div>
            }
        </>
    );
}

export default UserProfile;