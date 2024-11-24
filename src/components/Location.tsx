import { Typography } from '@mui/material';
import React from 'react';

type LocationProps = {
    location: string
};

const Location = (props: LocationProps): React.ReactElement => {
    const { location } = props;
    return (
        <div className="alignHorizontal center gap10">
            <button className="button" data-testid="updateLocation">Locate Me</button>
            <Typography>{location}</Typography>
        </div>
    );
};

export default Location;