import { useForm } from "react-hook-form";

function Login() {
    const {
        register,
        handleSubmit
    } = useForm();

    const onSubmit = (formData: any) => {

        // Define the API URL
        const apiUrl = 'https://localhost:7253/Login';

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

    function openModal() {
        var modal = document.getElementById('loginModal');
        modal!.style.display = 'flex';
    }

    function closeModal() {
        var modal = document.getElementById('loginModal');
        modal!.style.display = 'none';
    }

    return (
        <>
            <button id="loginButton" onClick={openModal}>Log In</button>
            <div id="loginModal" className="modal">
                <div className="modal-content">
                    <h2>Login Form</h2>
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
                            <button onClick={closeModal}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;