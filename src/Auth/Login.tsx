import axios from "../api/axios";
import axiosModule from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { backendUrl } from "../constants/constants";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Login = () => {

    const { setAuth, persist, setPersist } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

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
            <span>New user?</span><button className="register button" onClick={onRegisterClicked}>Register</button>
            <p style={{ color: 'red' }}>{errorMessage}</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="alignVertical center margin-bottom20">
                    <input className="loginField" placeholder="Username" data-testid="loginUsernameInput" {...register("Username")}></input>
                    <div className="passwordContainer alignHorizontal">
                        <input type={passwordVisible ? "text" : "password"} className="loginField passwordField" placeholder="Password" data-testid="loginPasswordInput" {...register("Password")}></input>
                        {passwordVisible
                            ? <VisibilityIcon onClick={() => setPasswordVisible(!passwordVisible)} className="passwordIcon" />
                            : <VisibilityOffIcon onClick={() => setPasswordVisible(!passwordVisible)} className="passwordIcon" />}
                    </div>
                </div>
                <div className="form-control">
                    <button className="login button" type="submit" data-testid="loginSubmit">Login</button>
                </div>
                <div className="alignHorizontal center">
                    <input
                        className="checkbox"
                        type="checkbox"
                        onChange={togglePersist}
                        checked={persist}
                    />
                    <label className="checkboxLabel" onClick={togglePersist}>Trust This Device</label>
                </div>
            </form>
        </>
    );
}

export default Login;