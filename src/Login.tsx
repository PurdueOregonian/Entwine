import axios from "./api/axios";
import axiosModule from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "./hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { backendUrl } from "./constants/constants";

const Login = () => {

    const { setAuth, persist, setPersist } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const [errorMessage, setErrorMessage] = useState('');

    const {
        register,
        handleSubmit
    } = useForm();

    const onSubmit = async (formData: any) => {
        try {
            const response = await axios.post(
                `${backendUrl}/Auth/Login`,
                JSON.stringify(formData),
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });
            const token = response?.data?.accessToken;
            setAuth({
                username: formData.Username,
                password: formData.Password,
                token: token
            });
            navigate(from, { replace: true });
            
        }
        catch (error) {
            if (axiosModule.isAxiosError(error)) {
                if (!error?.response) {
                    setErrorMessage('No Server Response');
                }
                if (error.response?.status === 400) {
                    setErrorMessage('Incorrect Username or Password');
                }
                else {
                    setErrorMessage('Unknown error logging in.');
                }
            }
        }
    };

    const togglePersist = () => {
        setPersist(prev => !prev);
    }

    const onRegisterClicked = () => {
        navigate('/Register');
    }

    useEffect(() => {
        localStorage.setItem("persist", persist.toString());
    }, [persist])

    return (
        <>
            <h2>Login</h2>
            <span>New user?</span><button onClick={onRegisterClicked}>Register</button>
            <p style={{ color: 'red' }}>{errorMessage}</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="topDown center">
                    <input className="loginField" placeholder="Username" {...register("Username")}></input>
                    <input className="loginField" placeholder="Password" {...register("Password")}></input>
                </div>
                <div className="form-control">
                    <button type="submit">Login</button>
                </div>
                <div>
                    <input
                        type="checkbox"
                        onChange={togglePersist}
                        checked={persist}
                    />
                    <label>Trust This Device</label>
                </div>
            </form>
        </>
    );
}

export default Login;