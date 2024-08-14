import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";

type RegisterProps = {
    setDisplayModal: Dispatch<SetStateAction<boolean>>;
}

const Register = ({ setDisplayModal }: RegisterProps) => {

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
                    setDisplayModal(false);
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
                        <input {...register("Username")}></input>
                    </label>
                    <label>
                        Password:
                        <input {...register("Password")}></input>
                    </label>
                    <div className="form-control">
                        <label></label>
                        <button type="submit">Register</button>
                        <button type="button" onClick={() => setDisplayModal(false)}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;