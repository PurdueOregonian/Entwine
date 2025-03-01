import useAxiosPrivate from "../hooks/useAxiosPrivate";
import axios from "axios";
import { backendUrl } from "../constants/constants";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { Gender } from "../types/Gender";
import { useNavigate, useParams } from "react-router-dom";
import { RetrievedOtherProfileData as PublicProfileData } from "../types/RetrievedOtherProfileData";
import useAuth from "../hooks/useAuth";
import useStaticData from "../hooks/useStaticData";

function UserProfile() {
    const { auth } = useAuth();
    const { userIdFromRoute } = useParams();
    const userId = userIdFromRoute ?? auth.userId;
    const [username, setUsername] = useState('');
    const [age, setAge] = useState<number | null>(null);
    const [gender, setGender] = useState<Gender | null>(null);
    const [interests, setInterests] = useState<number[]>([]);
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate();
    const { interestMap } = useStaticData();

    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const apiUrl = `${backendUrl}/Profile/${userId}`;

        axiosPrivate.get(apiUrl, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.status !== 200) {
                    throw new Error('Network response was not ok');
                }
                return response.data;
            })
            .then((data: PublicProfileData) => {
                if(data.age === null && data.gender === null){
                    navigate('/NotFound');
                }
                setUsername(data.username);
                setAge(data.age);
                setGender(data.gender ?? null);
                setInterests(data.interests);
                setLoaded(true);
            })
            .catch(error => {
                if (axios.isAxiosError(error)) {
                    console.error('Error:', error.message);
                }
            });
    }, [userId])

    return (
        <>
            {loaded &&
                <div className="alignVertical center">
                    <Typography variant="h4">{username}</Typography>
                    <div className="alignHorizontal center gap-2.5">
                        <Typography>Age</Typography>
                        <Typography>{age}</Typography>
                    </div>
                    <div className="alignHorizontal center gap-2.5">
                        <Typography>Gender</Typography>
                        <Typography>{gender}</Typography>
                    </div>
                    <div className="alignHorizontal center gap-2.5">
                        <Typography>Interests</Typography>
                        <Typography>{interests.map(interestId => interestMap.get(interestId)?.name ?? '').join(', ')}</Typography>
                    </div>
                </div>
            }
        </>
    );
}

export default UserProfile;