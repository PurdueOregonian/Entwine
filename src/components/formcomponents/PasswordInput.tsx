import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

type PasswordInputProps<T extends FieldValues> = {
    register: UseFormRegister<T>
    fieldValue: Path<T>
    placeholder?: string
}

const PasswordInput = <T extends FieldValues>({register, fieldValue, placeholder} : PasswordInputProps<T>) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    return(
        <div className="passwordContainer flex">
            <input
                type={passwordVisible ? "text" : "password"}
                className="pr-9 loginField"
                placeholder={placeholder}
                data-testid={`passwordInput-${fieldValue}`}
                {...register(fieldValue)}>
            </input>
            {passwordVisible
                ? <VisibilityIcon onClick={() => setPasswordVisible(!passwordVisible)} className="passwordIcon" />
                : <VisibilityOffIcon onClick={() => setPasswordVisible(!passwordVisible)} className="passwordIcon" />}
        </div>
    )
}

export default PasswordInput;