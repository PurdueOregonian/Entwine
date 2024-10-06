import axios from "./api/axios";
import axiosModule from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "./constants/constants";

const Register = () => {

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const {
        register,
        handleSubmit
    } = useForm();

    const onSubmit = async (formData: any) => {

        try {
            await axios.post(
                `${backendUrl}/Auth/Register`,
                JSON.stringify(formData),
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            // TODO display success message
            navigate('/Login');
        }
        catch (error) {
            if (axiosModule.isAxiosError(error)) {
                if (!error?.response) {
                    setErrorMessage('No Server Response');
                }
                if (error.response?.status === 400) {
                    setErrorMessage(error.response.statusText);
                }
                else {
                    setErrorMessage('Unknown error logging in.');
                }
            }
        }
    };

    return (
        <>
            <h2>Register</h2>
            <p style={{ color: 'red' }}>{errorMessage}</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>
                    Username:
                    <input data-testid="registerUsernameInput" {...register("Username")}></input>
                </label>
                <label>
                    Password:
                    <input data-testid="registerPasswordInput" {...register("Password")}></input>
                </label>
                <div className="form-control">
                    <label></label>
                    <button data-testid="registerSubmit" type="submit">Register</button>
                    <button type="button" onClick={() => navigate('/Login')}>Cancel</button>
                </div>
            </form>
        </>
    );
}

export default Register;