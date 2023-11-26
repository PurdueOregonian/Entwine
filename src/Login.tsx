import { useState } from "react";
import { useForm } from "react-hook-form";

type LoginPopupMode = 'Login' | 'Register';

function Login() {

    const [displayModal, setDisplayModal] = useState(false);
    const [loginPopupMode, setLoginPopupMode] = useState<LoginPopupMode>('Login');

    const displayTheModal = () => {
        setDisplayModal(true);
        setLoginPopupMode('Login');
    }

    const {
        register,
        handleSubmit
    } = useForm();

    const onSubmit = (formData: any) => {

        // Define the API URL
        const apiUrl = `https://localhost:7253/Auth/${loginPopupMode}`;

        // Make a GET request
        fetch(apiUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log(response);
                return response;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <>
            <button id="loginButton" onClick={() => displayTheModal()}>Log In</button>
            {displayModal &&
                <div id="loginModal" className="modal">
                    <div className="modal-content">
                        <h2>{loginPopupMode === 'Login' ? 'Login' : 'Register'}</h2>
                        {loginPopupMode === 'Login' &&
                            <>
                                <span>New user?</span><button onClick={() => setLoginPopupMode('Register')}>Register</button>
                            </>
                        }
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <label>
                                Username:
                                <input {...register("Username")}></input>
                            </label>
                            <label>
                                Password:
                                <input {...register("Password")}></input>
                            </label>
                            <div className="form-control">
                                <label></label>
                                <button type="submit">{loginPopupMode === 'Login' ? 'Login' : 'Register'}</button>
                                <button type="button" onClick={() => setDisplayModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>}
        </>
    );
}

export default Login;