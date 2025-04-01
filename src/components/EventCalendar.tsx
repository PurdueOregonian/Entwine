import { useEffect, useState } from "react";
import { axiosPrivate } from "../api/axios";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import CloseIcon from '@mui/icons-material/Close';
import { Box, Tooltip } from "@mui/material";

type EventCalendarProps = {
    onClose: () => void;
}

const EventCalendar = ({ onClose }: EventCalendarProps) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    useEffect(() => {
        const apiUrl = '/Events';

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
            .then((data: Event[]) => {
                setLoading(false);
                setEvents(data);
            })
            .catch(error => {
                setLoading(false);
                if (error.status === 404) {
                    setError('Error fetching events.');
                }
                if (axios.isAxiosError(error)) {
                    console.error('Error:', error.message);
                }
            });
    }, [])

    if (loading) return <div>Loading...</div>;

    if (error) return <div>{error}</div>;
    
    return (
        <Box className="bg-white border-2 border-black shadow-md p-4 w-19/20 h-19/20 translate-x-1/40 translate-y-1/40 flex flex-col">
            <button className="absolute left-1/2 -translate-x-1/2 top-2 button">Add Event</button>
            <Tooltip title="Close">
                <CloseIcon
                    data-testid="closeEventCalendar"
                    className="absolute top-5 right-2 muiClickableButton"
                    fontSize="large"
                    onClick={onClose}
                >
                </CloseIcon>
            </Tooltip>
            <FullCalendar
                height="115%"
                events={events}
                plugins={[dayGridPlugin, interactionPlugin]}
            />
        </Box>
    );
}

export default EventCalendar;