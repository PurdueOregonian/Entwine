import { useForm } from "react-hook-form";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import axios from "axios";
import { backendUrl } from "../constants/constants";
import DatePicker from "./DatePicker";
import LocationComponent from "./LocationComponent";
import { useEffect, useRef, useState } from "react";
import RectangleSelector from "./RectangleSelector";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import { RetrievedProfileData } from "../types/RetrievedProfileData";
import { Gender } from "../types/Gender";
import ColoredMessage from "./ColoredMessage";
import { ColoredMessageData } from "../types/ColoredMessageData";
import { useNavigate } from "react-router-dom";
import EditInterests from "./EditInterests";
import EditIcon from '@mui/icons-material/Edit';
import useStaticData from "../hooks/useStaticData";
import { Location } from "../types/Location";

type EditProfileComponentProps = {
    redirectOnSuccess: boolean;
};

const EditProfileComponent: React.FC<EditProfileComponentProps> = ({ redirectOnSuccess }) => {
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [year, setYear] = useState('');
    const [gender, setGender] = useState<Gender | null>(null);
    const [interests, setInterests] = useState<number[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [location, setLocation] = useState<Location>({city: '', country: ''});
    const coloredMessageRef = useRef<{ showMessage: (data: ColoredMessageData) => void }>();
    const navigate = useNavigate();
    const { interestMap, interestCategoryMap } = useStaticData();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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

        if (yearNumber < 1000 || yearNumber > (new Date()).getUTCFullYear()) {
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

        if (!gender) {
            coloredMessageRef.current?.showMessage({
                color: 'red',
                message: 'Gender not selected'
            });
            return;
        }

        const dateOfBirth = `${year}-${month}-${day}`;

        const dataToSubmit = {
            DateOfBirth: dateOfBirth,
            Gender: gender,
            Interests: interests
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
                    message: 'Successfully saved!' + (redirectOnSuccess ? ' Redirecting...' : ''),
                    vanishAfter: 3000
                });
                if (redirectOnSuccess) {
                    setTimeout(() => {
                        navigate('/');
                    }, 3000);
                }
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
                setInterests(data.interests ?? []);
                setLoaded(true);
            })
            .catch(error => {
                if (error.status === 404) {
                    setLoaded(true);
                }
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
                            <Typography>Interests</Typography>
                            <Typography>{interests.map(interestId => interestMap.get(interestId)?.name ?? '').join(', ')}</Typography>
                            <IconButton
                                data-testid="editInterestsButton"
                                onClick={() => setIsProfileModalOpen(true)}
                                aria-label="edit interests"
                                component="span">
                                <EditIcon />
                            </IconButton>

                            <Modal
                                open={isProfileModalOpen}
                                onClose={() => setIsProfileModalOpen(false)}
                                aria-labelledby="edit-interests-modal"
                                aria-describedby="edit-interests-modal-description"
                            >
                                <Box className="editProfileModal">
                                    <Typography id="edit-interests-modal" variant="h6" component="h2">
                                        Edit Interests
                                    </Typography>
                                    <EditInterests
                                        onClose={() => setIsProfileModalOpen(false)}
                                        interests={interests}
                                        setInterests={setInterests}
                                        interestMap={interestMap}
                                        interestCategoryMap={interestCategoryMap}
                                    />
                                </Box>
                            </Modal>
                        </div>
                        <div className="alignHorizontal center gap10">
                            <Typography>Location</Typography>
                            <LocationComponent
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

export default EditProfileComponent;