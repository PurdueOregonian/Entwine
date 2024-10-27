import { Typography } from "@mui/material";
import IntegerSliderRangeSelect from "../components/IntegerSliderRangeSelect";
import NavHeader from "../components/NavHeader";
import { useState } from "react";
import MultipleRectangleSelector from "../components/MultipleRectangleSelector";
import { useForm } from "react-hook-form";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { backendUrl } from "../constants/constants";
import axios from "axios";
import { SearchResultProfileData } from "../SearchResultProfileData";

function Search() {
    const [minAge, setMinAge] = useState(18);
    const [maxAge, setMaxAge] = useState(100);
    const [genders, setGenders] = useState<string[]>([]);

    const [usernames, setUsernames] = useState<string[]>([]);

    const {
        handleSubmit
    } = useForm();
    const axiosPrivate = useAxiosPrivate();

    const onSubmit = () => {
        const dataToSubmit = {
            MinAge: minAge,
            MaxAge: maxAge,
            Gender: genders
        };

        const apiUrl = `${backendUrl}/Search`;

        axiosPrivate.post(apiUrl, JSON.stringify(dataToSubmit), {
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
            .then(data => {
                const usernames = data.map((profile: SearchResultProfileData) => profile.username);
                setUsernames(usernames);
            })
            .catch(error => {
                if (axios.isAxiosError(error)) {
                    console.error('Error:', error.message);
                }
            });
    };

    return (
        <>
            <NavHeader />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="alignVertical center gap10">
                    <div className="alignHorizontal center gap10">
                        <Typography>Age</Typography>
                        <IntegerSliderRangeSelect
                            minValue={minAge}
                            setMinValue={setMinAge}
                            maxValue={maxAge}
                            setMaxValue={setMaxAge}
                            min={18}
                            max={100}
                        />
                    </div>
                    <div className="alignHorizontal center gap10">
                        <Typography>Gender</Typography>
                        <MultipleRectangleSelector
                            labels={["Male", "Female", "Other"]}
                            selected={genders}
                            setSelected={setGenders}
                        />
                    </div>
                    <div className="form-control">
                        <button className="button search" type="submit" data-testid="searchProfiles">Search</button>
                    </div>
                </div>
            </form>
            <div>
                {usernames.map((username, index) => (
                    <Typography key={index}>{username}</Typography>
                ))}
            </div>
        </>
    );
}

export default Search;