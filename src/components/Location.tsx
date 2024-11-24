import React from 'react';

type LocationProps = {
    
};

const Location = (props: LocationProps): React.ReactElement => {
    return (
        <button className="button" data-testid="updateLocation">Locate Me</button>
    );
};

export default Location;