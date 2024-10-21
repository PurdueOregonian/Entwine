import { useState } from "react";

type InputWithValidationProps = {
    placeholder: string;
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    validateInput: (input: string) => boolean;
}

const InputWithValidation: React.FC<InputWithValidationProps> = ({
    placeholder, input, setInput, validateInput
}) => {

    const [isValid, setIsValid] = useState(true);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const onBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (validateInput(e.target.value)) {
            setIsValid(true);
        }
        else{
            setIsValid(false);
        }
    }

    return (
        <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onBlur={onBlur}
            placeholder={placeholder}
            style={{ width: 30 + 7.5 * placeholder.length + 'px', borderColor: isValid ? 'black' : 'red', backgroundColor: isValid ? 'white' : 'pink' }}
        />
    );
}

export default InputWithValidation;