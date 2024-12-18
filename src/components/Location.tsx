import { Typography } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { backendUrl } from '../constants/constants';
import { axiosPrivate } from '../api/axios';

type LocationProps = {
    location: string;
    setLocation: React.Dispatch<React.SetStateAction<string>>;
};

const Location = (props: LocationProps): React.ReactElement => {
    const { location, setLocation } = props;
    const showLocation = async (location: GeolocationPosition) => {
        const latitude = location.coords.latitude;
        const longitude = location.coords.longitude;
        const apiUrl = `${backendUrl}/Location?latitude=${latitude}&longitude=${longitude}`;
        
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
                setLocation(`${response.data.city}, ${response.data.state ?? response.data.country}`);
            })
            .catch(error => {
                if (axios.isAxiosError(error)) {
                    console.error('Error:', error.message);
                }
            });
    }
    const locate = () => {
        navigator.geolocation.getCurrentPosition(showLocation);
    }
    return (
        <div className="alignHorizontal center gap10">
            <Typography>{location}</Typography>
            <button className="button" type="button" onClick={locate} data-testid="updateLocation">Locate Me</button>
        </div>
    );
};

export default Location;