import { Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import useStaticData from "../hooks/useStaticData";
import useProfileData from "../hooks/useProfileData";

function UserProfile() {
    const { userIdFromRoute } = useParams();
    const userId = userIdFromRoute;
    const { interestMap } = useStaticData();

    const { username, age, gender, interests, loaded } = useProfileData(userId);

    return (
        <>
            {loaded &&
                <div className="center">
                    <Typography variant="h4">{username}</Typography>
                    <div className="flex center gap-2.5">
                        <Typography>Age</Typography>
                        <Typography>{age}</Typography>
                    </div>
                    <div className="flex center gap-2.5">
                        <Typography>Gender</Typography>
                        <Typography>{gender}</Typography>
                    </div>
                    <div className="flex center gap-2.5">
                        <Typography>Interests</Typography>
                        <Typography>{interests.map(interestId => interestMap.get(interestId)?.name ?? '').join(', ')}</Typography>
                    </div>
                </div>
            }
        </>
    );
}

export default UserProfile;