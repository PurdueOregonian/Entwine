import axios from "../api/axios";
import axiosModule from "axios";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../constants/constants";
import { ColoredMessageData } from "../types/ColoredMessageData";
import ColoredMessage from "../components/ColoredMessage";

const Register = () => {

    const navigate = useNavigate();
    const coloredMessageRef = useRef<{ showMessage: (data: ColoredMessageData) => void }>();

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
                coloredMessageRef.current?.showMessage({
                    color: 'green',
                    message: 'Successfully registered! Redirecting...'
                });
                setTimeout(() => navigate('/Login'), 2000)
            }
            else {
                coloredMessageRef.current?.showMessage({
                    color: 'red',
                    message: 'Passwords do not match'
                });
            }
        }
        catch (error) {
            if (axiosModule.isAxiosError(error)) {
                if (!error?.response) {
                    coloredMessageRef.current?.showMessage({
                        color: 'red',
                        message: 'No Server Response'
                    });
                }
                if (error.response?.status === 400) {
                    coloredMessageRef.current?.showMessage({
                        color: 'red',
                        message: error.response.data
                    });
                }
                else {
                    coloredMessageRef.current?.showMessage({
                        color: 'red',
                        message: 'Unknown error logging in.'
                    });
                }
            }
        }
    };

    return (
        <>
            <h2>Register</h2>
            <ColoredMessage
                ref={coloredMessageRef}
            />
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