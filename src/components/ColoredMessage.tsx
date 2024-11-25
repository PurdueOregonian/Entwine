import { Typography } from '@mui/material';
import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { ColoredMessageData } from '../types/ColoredMessageData';

const ColoredMessage = forwardRef((_, ref) => {
    const [message, setMessage] = useState('');
    const [color, setColor] = useState('');
    const [fadingOut, setFadingOut] = useState(false);
    const [visible, setVisible] = useState(false);
    const vanishTimerRef = useRef<NodeJS.Timeout | null>(null);

    const showMessage = (data: ColoredMessageData) => {
        setVisible(true);
        setFadingOut(false);
        setMessage(data.message);
        setColor(data.color);

        if (vanishTimerRef.current) {
            clearTimeout(vanishTimerRef.current);
        }

        if (data.vanishAfter) {
            vanishTimerRef.current = setTimeout(() => {
                setFadingOut(true);
            }, data.vanishAfter);
        }
    }

    useImperativeHandle(ref, () => ({
        showMessage,
    }));

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
});

export default ColoredMessage;