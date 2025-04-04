import { Typography } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { axiosPrivate } from '../../api/axios';
import { Location } from '../../types/Location';
import { FieldValues, Path, UseFormWatch } from 'react-hook-form';

type LocationProps<TForm extends FieldValues> = {
    fieldValue: Path<TForm>
    setValue: (field: Path<TForm>, value: Location) => void
    watch: UseFormWatch<TForm>;
};

const LocationComponent = <TForm extends FieldValues>(
    {fieldValue, setValue, watch}: LocationProps<TForm>): React.ReactElement => {
    const location = watch(fieldValue) as Location | null;
    const showLocation = async (location: GeolocationPosition) => {
        const latitude = location.coords.latitude;
        const longitude = location.coords.longitude;
        const apiUrl = `/Location?latitude=${latitude}&longitude=${longitude}`;
        
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
                setValue(fieldValue, response.data);
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
        <div className="flex justify-center items-center gap-2.5">
            {location && (
                <Typography>{location.city}, {location.state ?? location.country}</Typography>
            )}
            <button className="button" type="button" onClick={locate} data-testid="updateLocation">Locate Me</button>
        </div>
    );
};

export default LocationComponent;