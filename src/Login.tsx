import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";

type LoginProps = {
    setDisplayModal: Dispatch<SetStateAction<boolean>>;
    setDisplayRegisterModal: Dispatch<SetStateAction<boolean>>;
    setLoggedInUser: Dispatch<SetStateAction<string | null>>;
}

const Login = ({ setDisplayModal, setDisplayRegisterModal, setLoggedInUser }: LoginProps) => {

    const [errorMessage, setErrorMessage] = useState('');

    const {
        register,
        handleSubmit
    } = useForm();

    const onSubmit = (formData: any) => {

        // Define the API URL
        const apiUrl = 'https://localhost:7253/Auth/Login';

        fetch(apiUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (response.ok) {
                    setLoggedInUser(formData.Username)
                    localStorage.setItem('username', formData.Username)
                    setDisplayModal(false);
                }
                else {
                    response.text().then(errorMessage => {
                        setErrorMessage(errorMessage);
                    })
                }
            })
            .catch(() => {
                setErrorMessage('An unexpected error occurred logging in.');
            });
    };

    const onRegisterClicked = () => {
        setDisplayModal(false);
        setDisplayRegisterModal(true);
    }

    return (
        <div id="loginModal" className="modal">
            <div className="modal-content">
                <h2>Login</h2>
                <span>New user?</span><button onClick={onRegisterClicked}>Register</button>
                <p style={{ color: 'red' }}>{errorMessage}</p>
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
                        <button type="submit">Login</button>
                        <button type="button" onClick={() => setDisplayModal(false)}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;