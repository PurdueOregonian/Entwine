import { useForm } from "react-hook-form";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import axios from "axios";
import DatePicker, { dateSchema } from "./formcomponents/DatePicker";
import LocationComponent from "./formcomponents/LocationComponent";
import { useEffect, useRef, useState } from "react";
import RectangleSelector from "./formcomponents/RectangleSelector";
import { IconButton, Typography } from "@mui/material";
import { RetrievedProfileData } from "../types/RetrievedProfileData";
import { Gender } from "../types/Gender";
import ColoredMessage from "./ColoredMessage";
import { ColoredMessageData } from "../types/ColoredMessageData";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import useStaticData from "../hooks/useStaticData";
import EditInterestsModal from "./formcomponents/EditInterestsModal";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const EditProfileSchema = z.object({
    ...dateSchema,
    gender: z.nativeEnum(Gender, {
        required_error: "Gender not selected",
    }),
    interests: z.array(z.number().int()),
    location: z.object({
        city: z.string(),
        state: z.string().optional(),
        country: z.string()
    }, {
        required_error: "Location not selected",
    })
});

type EditProfileForm = z.infer<typeof EditProfileSchema>;

type EditProfileComponentProps = {
    redirectOnSuccess: boolean;
};

const EditProfileComponent: React.FC<EditProfileComponentProps> = ({ redirectOnSuccess }) => {
    const [loaded, setLoaded] = useState(false);
    const coloredMessageRef = useRef<{ showMessage: (data: ColoredMessageData) => void }>();
    const navigate = useNavigate();
    const { interestMap, interestCategoryMap } = useStaticData();
    const [isInterestsModalOpen, setIsInterestsModalOpen] = useState(false);

    const {
        register,
        setValue,
        watch,
        handleSubmit
    } = useForm<EditProfileForm>({
        resolver: zodResolver(EditProfileSchema)
    });
    const interests = watch('interests') as number[] || [];
    const axiosPrivate = useAxiosPrivate();

    const isValidDate: (year: string, month: string, day: string) => boolean = (
        year: string,
        month: string,
        day: string
    ) => {
        const yearNum = Number(year);
        const monthNum = Number(month);
        const dayNum = Number(day);

        const date = new Date(yearNum, monthNum - 1, dayNum);

        return (
            date.getFullYear() === yearNum &&
            date.getMonth() === monthNum - 1 &&
            date.getDate() === dayNum
        );
    }

    const onInvalid = (errors: any) => {
        console.error("Validation Errors:", errors);
    
        const errorMessages = Object.values(errors).map((error: any) => error.message);
    
        if (coloredMessageRef.current) {
            coloredMessageRef.current.showMessage({
                color: "red",
                message: errorMessages.join("\n")
            });
        }
    };

    const onSubmit = (formData: EditProfileForm) => {
        if (!isValidDate(formData.year, formData.month, formData.day)) {
            coloredMessageRef.current?.showMessage({
                color: 'red',
                message: 'Date is invalid'
            });
            return;
        }

        const dateOfBirth = `${formData.year}-${formData.month}-${formData.day}`;

        const dataToSubmit = {
            DateOfBirth: dateOfBirth,
            Gender: formData.gender,
            Interests: formData.interests,
            Location: formData.location
        };

        const apiUrl = '/Profile/Save';

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
        const apiUrl = '/Profile';

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
                    setValue('year', year);
                    setValue('month', month);
                    setValue('day', day);
                } else {
                    setValue('year', '');
                    setValue('month', '');
                    setValue('day', '');
                }
                setValue('gender', data.gender);
                setValue('interests', data.interests ?? []);
                setValue('location', data.location ?? null);
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
                <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
                    <div className="justify-center items-center">
                        <div className="flex justify-center items-center gap-2.5">
                            <Typography>Date of Birth</Typography>
                            <DatePicker
                                register={register}
                                schema={EditProfileSchema}
                            />
                        </div>
                        <div className="flex justify-center items-center gap-2.5">
                            <Typography>Gender</Typography>
                            <RectangleSelector
                                fieldValue="gender"
                                setValue={setValue}
                                watch={watch}
                                labels={Object.values(Gender)}
                            />
                        </div>
                        <div className="flex justify-center items-center gap-2.5">
                            <Typography>Interests</Typography>
                            <Typography>{interests.map(interestId => interestMap.get(interestId)?.name ?? '').join(', ')}</Typography>
                            <IconButton
                                data-testid="editInterestsButton"
                                onClick={() => setIsInterestsModalOpen(true)}
                                aria-label="edit interests"
                                component="span">
                                <EditIcon />
                            </IconButton>

                            <EditInterestsModal
                                open={isInterestsModalOpen}
                                setOpen={setIsInterestsModalOpen}
                                interestMap={interestMap}
                                interestCategoryMap={interestCategoryMap}
                                fieldValue="interests"
                                setValue={setValue}
                                watch={watch}
                            />
                        </div>
                        <div className="flex justify-center items-center gap-2.5">
                            <Typography>Location</Typography>
                            <LocationComponent
                                fieldValue="location"
                                setValue={setValue}
                                watch={watch}
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