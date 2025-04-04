import { Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import useStaticData from "../hooks/useStaticData";
import useProfileData from "../hooks/useProfileData";
import useAuth from "../hooks/useAuth";

function UserProfile() {
    const { auth } = useAuth();
    const { userIdFromRoute } = useParams();
    const userId = userIdFromRoute;
    const { interestMap } = useStaticData();

    const { profileData } = useProfileData((userId ?? auth.userId?.toString()) || ''); // Empty string should never be used

    return (
        <>
            {profileData &&
                <div className="justify-center items-center">
                    <Typography variant="h4">{profileData.username}</Typography>
                    <div className="flex justify-center items-center gap-2.5">
                        <Typography>Age</Typography>
                        <Typography>{profileData.age}</Typography>
                    </div>
                    <div className="flex justify-center items-center gap-2.5">
                        <Typography>Gender</Typography>
                        <Typography>{profileData.gender}</Typography>
                    </div>
                    <div className="flex justify-center items-center gap-2.5">
                        <Typography>Interests</Typography>
                        <Typography>{profileData.interests.map(interestId => interestMap.get(interestId)?.name ?? '').join(', ')}</Typography>
                    </div>
                    <div className="flex justify-center items-center gap-2.5">
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