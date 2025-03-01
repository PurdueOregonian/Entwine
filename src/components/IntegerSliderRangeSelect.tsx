import { Slider, TextField } from "@mui/material";
import { useState } from "react";

type IntegerSliderRangeSelectProps = {
    min: number;
    max: number
    minValue: number;
    setMinValue: React.Dispatch<React.SetStateAction<number>>;
    maxValue: number;
    setMaxValue: React.Dispatch<React.SetStateAction<number>>;
}

const IntegerSliderRangeSelect: React.FC<IntegerSliderRangeSelectProps> = ({
    min, max, minValue, setMinValue, maxValue, setMaxValue
}) => {
    const [tempMinValue, setTempMinValue] = useState(minValue);
    const [tempMaxValue, setTempMaxValue] = useState(maxValue);

    const handleSliderChange = (_event: Event, newValue: number | number[]) => {
        const [newMin, newMax] = newValue as number[];
        setMinValue(newMin);
        setMaxValue(newMax);
        setTempMinValue(newMin);
        setTempMaxValue(newMax);
    };

    const handleMinInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTempMinValue(Number(event.target.value));
    };

    const handleMaxInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTempMaxValue(Number(event.target.value));
    };

    const handleMinBlur = () => {
        if (tempMinValue < min) {
            setMinValue(min);
            setTempMinValue(min);
        } else if (tempMinValue > maxValue) {
            setMinValue(maxValue);
            setTempMinValue(maxValue);
        } else {
            setMinValue(tempMinValue);
        }
    };

    const handleMaxBlur = () => {
        if (tempMaxValue > max) {
            setMaxValue(max);
            setTempMaxValue(max);
        } else if (tempMaxValue < minValue) {
            setMaxValue(minValue);
            setTempMaxValue(minValue);
        } else {
            setMaxValue(tempMaxValue);
        }
    };

    return (
        <div className="flex center gap-5 w-100">
            <TextField
                label="Min"
                type="number"
                value={tempMinValue}
                onChange={handleMinInputChange}
                onBlur={handleMinBlur}
                slotProps={{
                    htmlInput: {
                        "data-testid": "minField",
                        min: min,
                        max: max,
                        style: { width: '80px', padding: '8px', backgroundColor: 'white' }
                    }
                }}
            />
            <Slider
                value={[minValue, maxValue]}
                min={min}
                max={max}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
            />
            <TextField
                label="Max"
                type="number"
                value={tempMaxValue}
                onChange={handleMaxInputChange}
                onBlur={handleMaxBlur}
                slotProps={{
                    htmlInput: {
                        "data-testid": "maxField",
                        min: min,
                        max: max,
                        style: { width: '80px', padding: '8px', backgroundColor: 'white' }
                    }
                }}
            />
        </div>
    );
}

export default IntegerSliderRangeSelect;