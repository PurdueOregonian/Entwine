import { Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { ColoredMessageData } from '../types/ColoredMessageData';

type ColoredMessageProps = {
    data: ColoredMessageData
};

const ColoredMessage = (props: ColoredMessageProps): React.ReactElement => {
    const { message, color, vanishAfter } = props.data;
    const [fadingOut, setFadingOut] = useState(false);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setVisible(true);
        setFadingOut(false);

        if (vanishAfter) {
            const timer = setTimeout(() => {
                setFadingOut(true);
            }, vanishAfter);

            return () => clearTimeout(timer);
        }
    }, [props]);

    useEffect(() => {
        if (fadingOut) {
            const removeTimer = setTimeout(() => {
                setVisible(false);
            }, 1000);
            return () => clearTimeout(removeTimer);
        }
    }, [fadingOut]);

    return (
        <>
            {visible && (
                <Typography style={{ color, transition: 'opacity 1s', opacity: fadingOut ? 0 : 1 }}>
                    {message}
                </Typography>
            )}
        </>
    );
};

export default ColoredMessage;