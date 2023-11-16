import { useForm } from "react-hook-form";

function CreateProfile() {
    const {
        register,
        handleSubmit
    } = useForm();

    const onSubmit = (formData: any) => {

        // Define the API URL
        const apiUrl = 'https://localhost:7253/SaveProfile';

        fetch('https://localhost:7253/Login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({Username: "bogus", Password: "bogus"})
        })

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
        <div className="CreateProfile">
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>
                    Name:
                    <input {...register("Name") }></input>
                </label>
                <label>
                    Interest:
                    <input {...register("Interest")}></input>
                </label>
                <div className="form-control">
                    <label></label>
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    );
}

export default CreateProfile;