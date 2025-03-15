import { Typography } from "@mui/material";
import IntegerSliderRangeSelect from "../components/IntegerSliderRangeSelect";
import { useState } from "react";
import MultipleRectangleSelector from "../components/MultipleRectangleSelector";
import { useForm } from "react-hook-form";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import axios from "axios";
import { UserSearchResult } from "../types/UserSearchResult";
import { useNavigate } from "react-router-dom";
import { User } from "../types/User";

function Search() {
    const navigate = useNavigate();

    const [minAge, setMinAge] = useState(18);
    const [maxAge, setMaxAge] = useState(100);
    const [genders, setGenders] = useState<string[]>([]);

    const [users, setUsers] = useState<User[]>([]);

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

        const apiUrl = '/Search/Users/Profile';

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
                const users = data.map(({ id, username }: UserSearchResult) => ({ id, username }));
                setUsers(users);
            })
            .catch(error => {
                if (axios.isAxiosError(error)) {
                    console.error('Error:', error.message);
                }
            });
    };

    // TODO replace results with links to profiles and/or more info
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="center gap-2.5">
                    <div className="flex center gap-2.5">
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
                    <div className="flex center gap-2.5">
                        <Typography>Gender</Typography>
                        <MultipleRectangleSelector
                            labels={["Male", "Female", "Other"]}
                            selected={genders}
                            setSelected={setGenders}
                        />
                    </div>
                    <div className="form-control">
                        <button className="button" type="submit" data-testid="searchProfiles">Search</button>
                    </div>
                </div>
            </form>
            <div>
                {users.map((user, index) => (
                    <div key={index}>
                        <a className="navLink" onClick={() => navigate(`/Profile/${user.id}`)}>
                            {user.username}
                        </a>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Search;