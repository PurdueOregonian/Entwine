import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';

type PasswordInputProps = {
    register: UseFormRegister<FieldValues>
    fieldValue: string
    placeholder?: string
}

const PasswordInput = ({register, fieldValue, placeholder} : PasswordInputProps) => {
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