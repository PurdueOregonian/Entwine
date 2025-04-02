import { useEffect, useState } from "react";
import { axiosPrivate } from "../api/axios";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import CloseIcon from '@mui/icons-material/Close';
import { Tooltip } from "@mui/material";
import AddEventForm from "./AddEventForm";

type EventCalendarProps = {
    onClose: () => void;
}

const EventCalendar = ({ onClose }: EventCalendarProps) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [eventForm, setEventForm] = useState(false);
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

    if (loading) return (
        <div>Loading...</div>
    );

    if (error) return (
        <div>{error}</div>
    );
    
    return (
        <>
            <Tooltip title="Close">
                <CloseIcon
                    data-testid="closeEventCalendar"
                    className="absolute top-5 right-2 muiClickableButton"
                    fontSize="large"
                    onClick={onClose}
                >
                </CloseIcon>
            </Tooltip>
            {eventForm && <AddEventForm setEventForm={setEventForm} />}
            {!eventForm &&
                <>
                    <button className="absolute left-1/2 -translate-x-1/2 top-2 button" onClick={() => setEventForm(true)}>Add Event</button>
                    <FullCalendar
                        height="115%"
                        events={events}
                        plugins={[dayGridPlugin, interactionPlugin]}
                    />
                </>
            }
            
        </>
    );
}

export default EventCalendar;