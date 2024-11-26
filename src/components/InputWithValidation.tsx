import { useState } from "react";

type InputWithValidationProps = {
    testId: string;
    placeholder: string;
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    validateInput: (input: string) => boolean;
    onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputWithValidation: React.FC<InputWithValidationProps> = ({
    testId, placeholder, input, setInput, validateInput, onBlur
}) => {

    const [isValid, setIsValid] = useState(true);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <input
            data-testid={testId}
            type="text"
            value={input}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            style={{ width: 30 + 7.5 * placeholder.length + 'px', borderColor: isValid ? 'black' : 'red', backgroundColor: isValid ? 'white' : 'pink' }}
        />
    );
}

export default InputWithValidation;