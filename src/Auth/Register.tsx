import axios from "../api/axios";
import axiosModule from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../constants/constants";

const Register = () => {

    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('green');

    const setErrorMessage = (theMessage: string) => {
        setMessage(theMessage);
        setMessageColor('red');
    }

    const setSuccessMessage = (theMessage: string) => {
        setMessage(theMessage);
        setMessageColor('green');
    }

    const {
        register,
        handleSubmit
    } = useForm();

    const onSubmit = async (formData: any) => {

        try {
            if (formData.Password === formData.ConfirmPassword) {
                await axios.post(
                    `${backendUrl}/Auth/Register`,
                    JSON.stringify({
                        Username: formData.Username,
                        Password: formData.Password
                    }),
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                setSuccessMessage('Successfully registered! Redirecting...');
                setTimeout(() => navigate('/Login'), 2000)
            }
            else {
                setErrorMessage('Passwords do not match');
            }
        }
        catch (error) {
            if (axiosModule.isAxiosError(error)) {
                if (!error?.response) {
                    setErrorMessage('No Server Response');
                }
                if (error.response?.status === 400) {
                    setErrorMessage(error.response.data);
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
            <p style={{ color: messageColor }}>{message}</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="alignVertical center margin-bottom20">
                    <input className="loginField" placeholder="Username" data-testid="registerUsernameInput" {...register("Username")}></input>
                    <input type="password" className="loginField" placeholder="Password" data-testid="registerPasswordInput" {...register("Password")}></input>
                    <input type="password" className="loginField" placeholder="Confirm Password" data-testid="registerConfirmPasswordInput" {...register("ConfirmPassword")}></input>
                </div>
                <div className="form-control alignVertical center">
                    <button className="button" data-testid="registerSubmit" type="submit">Register</button>
                    <button className="button" type="button" onClick={() => navigate('/Login')}>Cancel</button>
                </div>
            </form>
        </>
    );
}

export default Register;