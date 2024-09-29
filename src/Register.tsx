import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Register = () => {

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const {
        register,
        handleSubmit
    } = useForm();

    const onSubmit = (formData: any) => {

        // Define the API URL
        const apiUrl = 'https://localhost:7253/Auth/Register';

        fetch(apiUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (response.ok) {
                    // TODO display success message
                    navigate('/Login');
                }
                else {
                    response.text().then(errorMessage => {
                        setErrorMessage(errorMessage);
                    })
                }
            })
            .catch(() => {
                setErrorMessage('An unexpected error occurred registering.');
            });
    };

    return (
        <div id="loginModal" className="modal">
            <div className="modal-content">
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
            </div>
        </div>
    );
}

export default Register;