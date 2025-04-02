import axios, { axiosPrivate } from "../api/axios";
import axiosModule from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
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
                '/Auth/Login',
                JSON.stringify(formData),
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });
            const userId = response?.data?.userId;
            const token = response?.data?.accessToken;
            setAuth({
                username: formData.Username,
                password: formData.Password,
                token: token,
                userId: userId
            });
            axiosPrivate.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const apiUrl = '/Profile';
            axiosPrivate.get(apiUrl, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    if(response.data.dateOfBirth){
                        navigate(from, { replace: true });
                    }
                    else{
                        navigate('/SetupProfile');
                    }
                })
                .catch(error => {
                    if (error.response) {
                        if (error.response.status === 404) {
                            navigate('/SetupProfile');
                        }
                    }
                })
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
            <div className="text-2xl p-4 font-semibold">Login</div>
            <span>New user?</span><button className="button" onClick={onRegisterClicked}>Register</button>
            <p style={{ color: 'red' }}>{errorMessage}</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col justify-center items-center">
                    <input className="loginField" placeholder="Username" data-testid="loginUsernameInput" {...register("Username")}></input>
                    <div className="passwordContainer flex">
                        <input type={passwordVisible ? "text" : "password"} className="pr-9 loginField" placeholder="Password" data-testid="loginPasswordInput" {...register("Password")}></input>
                        {passwordVisible
                            ? <VisibilityIcon onClick={() => setPasswordVisible(!passwordVisible)} className="passwordIcon" />
                            : <VisibilityOffIcon onClick={() => setPasswordVisible(!passwordVisible)} className="passwordIcon" />}
                    </div>
                </div>
                <div className="form-control">
                    <button className="button" type="submit" data-testid="loginSubmit">Login</button>
                </div>
                <div className="flex justify-center items-center">
                    <input
                        className="checkbox w-5 h-5 cursor-pointer"
                        type="checkbox"
                        onChange={togglePersist}
                        checked={persist}
                    />
                    <label className="cursor-pointer text-xl ml-1" onClick={togglePersist}>Trust This Device</label>
                </div>
            </form>
        </>
    );
}

export default Login;