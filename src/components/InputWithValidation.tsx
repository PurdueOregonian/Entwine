import { TextField } from "@mui/material";
import { useState } from "react";

type InputWithValidationProps = {
    label: string;
    testId: string;
    placeholder: string;
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    validateInput: (input: string) => boolean;
    onBlur?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const InputWithValidation: React.FC<InputWithValidationProps> = ({
    label, testId, placeholder, input, setInput, validateInput, onBlur
}) => {

    const [isValid, setIsValid] = useState(true);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const handleBlur = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (validateInput(e.target.value)) {
            setIsValid(true);
        }
        else{
            setIsValid(false);
        }
        if (onBlur) {
            onBlur(e);
        }
    }

    return (
        <TextField
            label={label}
            type="text"
            value={input}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            slotProps={{
                htmlInput: {
                    "data-testid": testId,
                    style: {
                        height: 6,
                        width: 30 + 7.5 * placeholder.length + 'px',
                        borderColor: isValid ? 'black' : 'red',
                        backgroundColor: isValid ? 'white' : 'pink'
                    }
                }
            }}
        />
    );
}

export default InputWithValidation;