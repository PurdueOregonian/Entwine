import EditProfileComponent from "../components/EditProfileComponent";
import useAuth from "../hooks/useAuth";

function SetupProfile() {
    const { auth } = useAuth();

    return (<>
        <span>{`Welcome, ${auth.username}!`}</span>
        <EditProfileComponent
            redirectOnSuccess={true}
        />
    </>)
}

export default SetupProfile;