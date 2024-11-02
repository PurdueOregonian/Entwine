import NavHeader from "../components/NavHeader";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import axios from "axios";
import { backendUrl } from "../constants/constants";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { Gender } from "../types/Gender";
import { useParams } from "react-router-dom";
import { RetrievedOtherProfileData } from "../types/RetrievedOtherProfileData";

function OtherUserProfile() {
    const { username } = useParams();
    const [age, setAge] = useState<number | null>(null);
    const [gender, setGender] = useState<Gender | null>(null);
    const [loaded, setLoaded] = useState(false);

    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const apiUrl = `${backendUrl}/Profile/${username}`;

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
            .then((data: RetrievedOtherProfileData) => {
                setAge(data.age);
                setGender(data.gender ?? null);
                setLoaded(true);
            })
            .catch(error => {
                if (axios.isAxiosError(error)) {
                    console.error('Error:', error.message);
                }
            });
    }, [username])

    return (
        <>
            <NavHeader />
            {loaded &&
                <div className="alignVertical center">
                    <Typography variant="h4">{username}</Typography>
                    <div className="alignHorizontal center gap10">
                        <Typography>Age</Typography>
                        <Typography>{age}</Typography>
                    </div>
                    <div className="alignHorizontal center gap10">
                        <Typography>Gender</Typography>
                        <Typography>{gender}</Typography>
                    </div>
                </div>
            }
        </>
    );
}

export default OtherUserProfile;