import { useForm } from "react-hook-form";
import NavHeader from "./NavHeader";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import axios from "axios";
import { backendUrl } from "../constants/constants";
import DatePicker from "./DatePicker";
import Location from "./Location";
import { useEffect, useRef, useState } from "react";
import RectangleSelector from "./RectangleSelector";
import { Typography } from "@mui/material";
import { RetrievedProfileData } from "../types/RetrievedProfileData";
import { Gender } from "../types/Gender";
import ColoredMessage from "./ColoredMessage";
import { ColoredMessageData } from "../types/ColoredMessageData";

function ProfileComponent() {
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [year, setYear] = useState('');
    const [gender, setGender] = useState<Gender | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [location, setLocation] = useState('');
    const coloredMessageRef = useRef<{ showMessage: (data: ColoredMessageData) => void }>();

    const {
        handleSubmit
    } = useForm();
    const axiosPrivate = useAxiosPrivate();

    const isValidDate: () => boolean = () => {
        const yearNumber = Number(year);
        const monthNumber = Number(month);
        const dayNumber = Number(day);
        if (isNaN(monthNumber) || isNaN(dayNumber) || isNaN(yearNumber)) {
            return false;
        }

        if (yearNumber < 1000 || yearNumber > 9999) {
            return false;
        }

        if (monthNumber < 1 || monthNumber > 12) {
            return false;
        }

        const daysInMonth = new Date(yearNumber, monthNumber, 0).getDate();
        if (dayNumber < 1 || dayNumber > daysInMonth) {
            return false;
        }

        return true;
    }

    const onSubmit = () => {
        if (!isValidDate()) {
            coloredMessageRef.current?.showMessage({
                color: 'red',
                message: 'Date is invalid'
            });
            return;
        }

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
                coloredMessageRef.current?.showMessage({
                    color: 'green',
                    message: 'Successfully saved!',
                    vanishAfter: 3000
                });
                return response;
            })
            .catch(error => {
                coloredMessageRef.current?.showMessage({
                    color: 'red',
                    message: 'Error saving profile',
                    vanishAfter: 3000
                });
                if (axios.isAxiosError(error)) {
                    console.error('Error:', error.message);
                }
            });
    };

    useEffect(() => {
        const apiUrl = `${backendUrl}/Profile`;

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
            .then((data: RetrievedProfileData) => {
                if (data.dateOfBirth) {
                    const [year, month, day] = data.dateOfBirth.split('-').map(String);
                    setYear(year);
                    setMonth(month);
                    setDay(day);
                } else {
                    setYear('');
                    setMonth('');
                    setDay('');
                }
                setGender(data.gender ?? null);
                setLoaded(true);
            })
            .catch(error => {
                if (axios.isAxiosError(error)) {
                    console.error('Error:', error.message);
                }
            });
    }, [])

    return (
        <>
            {loaded &&
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
                                selected={gender}
                                setSelected={setGender}
                            />
                        </div>
                        <div className="alignHorizontal center gap10">
                            <Typography>Location</Typography>
                            <Location
                                location={location}
                                setLocation={setLocation}
                            />
                        </div>
                        <div className="form-control">
                            <button className="button" type="submit" data-testid="saveProfile">Save</button>
                        </div>
                        <ColoredMessage
                            ref={coloredMessageRef}
                        />
                    </div>
                </form>
            }
        </>
    );
}

export default ProfileComponent;