import { TextField } from "@mui/material";
import { useState } from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

type InputWithValidationProps<T extends FieldValues> = {
    register: UseFormRegister<T>
    fieldValue: Path<T>;
    label: string;
    testId: string;
    placeholder: string;
    validateInput: (input: string) => boolean;
    processValue?: (input: string) => string;
}

const InputWithValidation = <T extends FieldValues>({
    register,
    fieldValue,
    label,
    testId,
    placeholder,
    validateInput,
    processValue
}: InputWithValidationProps<T>) => {

    const [isValid, setIsValid] = useState(true);

    const handleBlur = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (processValue) {
            let value = e.target.value;
            value = processValue(value);
            e.target.value = value;
        }
        if (validateInput(e.target.value)) {
            setIsValid(true);
        }
        else{
            setIsValid(false);
        }
    }

    return (
        <TextField
            label={label}
            type="text"
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
            {...register(fieldValue, {
                onBlur: (e) => {
                    handleBlur(e);
                },
            })}
        />
    );
}

export default InputWithValidation;