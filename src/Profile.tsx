import { useForm } from "react-hook-form";
import NavHeader from "./NavHeader";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import axios from "axios";
import { backendUrl } from "./constants/constants";
import DatePicker from "./DatePicker";
import { useState } from "react";
import RectangleSelector from "./RectangleSelector";
import { Typography } from "@mui/material";

function Profile() {
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [year, setYear] = useState('');
    const [gender, setGender] = useState('');

    const {
        handleSubmit
    } = useForm();
    const axiosPrivate = useAxiosPrivate();

    const onSubmit = () => {
        const dateOfBirth = `${year}-${month}-${day}`;

        const dataToSubmit = {
            DateOfBirth: dateOfBirth,
            Gender: gender
        };

        const apiUrl = `${backendUrl}/Profile/Save`;

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
            return response;
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
                <div className="alignVertical center">
                    <div className="alignHorizontal center gap10">
                        <Typography>Date of Birth</Typography>
                        <DatePicker
                            month={month}
                            day={day}
                            year={year}
                            setMonth={setMonth}
                            setDay={setDay}
                            setYear={setYear}
                        />
                    </div>
                    <div className="alignHorizontal center gap10">
                        <Typography>Gender</Typography>
                        <RectangleSelector
                            labels={["Male", "Female", "Other"]}
                            onSelect={(gender: string) => { setGender(gender) }}
                        />
                    </div>
                    <div className="form-control">
                        <button className="button save" type="submit" data-testid="saveProfile">Save</button>
                    </div>
                </div>
            </form>
        </>
    );
}

export default Profile;