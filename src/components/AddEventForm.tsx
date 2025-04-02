import { useState } from "react";
import ArrowBack from '@mui/icons-material/ArrowBack';
import { Box, TextField, Tooltip, Typography } from "@mui/material";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useForm } from "react-hook-form";

type AddEventFormProps = {
    setEventForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddEventForm = ({ setEventForm }: AddEventFormProps) => {
    
    const [title, setTitle] = useState('');
    const [error, setError] = useState<string | null>(null);
    const {
        handleSubmit
    } = useForm();
    const axiosPrivate = useAxiosPrivate();
    const sendEvent = (event: any) => {
        const apiUrl = '/Events';
        axiosPrivate.post(apiUrl, {
                start: new Date(),
                end: new Date(),
                title: event.Name,
                maxParticipants: event.MaxParticipants
            })
            .then((response) => {
                if (response.status !== 200) {
                throw new Error('Network response was not ok');
                }
                return response.data;
            })
            .then((data) => {
                var chatId = data.id;
            })
            .catch((err) => console.error('Error adding event:', err));
    }

    if (error) return <div>{error}</div>;
    
    return (
        <div className="flex flex-col justify-center items-center">
            <Tooltip title="Back">
                <ArrowBack
                    data-testid="backFromAddEventForm"
                    className="absolute top-5 left-2 muiClickableButton"
                    fontSize="large"
                    onClick={() => setEventForm(false)}
                >
                </ArrowBack>
            </Tooltip>
            <Typography variant="h5" className="text-center mb-4">Add Event</Typography>
            <form onSubmit={handleSubmit(sendEvent)}>
                <div className="justify-center items-center">
                    <div className="flex items-center gap-2.5">
                        <Typography>Name</Typography>
                        <TextField
                            type="text"
                            className="h-9"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="flex form-control justify-center items-center">
                        <button className="button" type="submit" data-testid="doneAddEvent">Done</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default AddEventForm;