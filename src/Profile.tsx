import { useForm } from "react-hook-form";
import NavHeader from "./NavHeader";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import axios from "axios";
import { backendUrl } from "./constants/constants";

function Profile() {
    const {
        register,
        handleSubmit
    } = useForm();
    const axiosPrivate = useAxiosPrivate();

    const onSubmit = (formData: any) => {

        const apiUrl = `${backendUrl}/Profile/Save`;

        axiosPrivate.post(apiUrl,
            JSON.stringify(formData),
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.status !== 200) {
                    throw new Error('Network response was not ok');
                }
                return response;
            })
            .catch(error => {
                if (axios.isAxiosError(error)) {
                    console.error('Error:', error.message);
                }
            });
    };

    return (
        <>
            <NavHeader />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="alignVertical">
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
                        <button className="button save" type="submit">Save</button>
                    </div>
                </div>
            </form>
        </>
    );
}

export default Profile;