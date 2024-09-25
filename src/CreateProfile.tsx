import { useForm } from "react-hook-form";

function CreateProfile() {
    const {
        register,
        handleSubmit
    } = useForm();
    const token = localStorage.getItem('token'); 

    const onSubmit = (formData: any) => {

        // Define the API URL
        const apiUrl = 'https://localhost:7253/Profile/Save';

        // Make a GET request
        fetch(apiUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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
                    <button type="submit">Save</button>
                </div>
            </form>
        </div>
    );
}

export default CreateProfile;