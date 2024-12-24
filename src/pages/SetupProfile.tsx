import ProfileComponent from "../components/ProfileComponent";
import useAuth from "../hooks/useAuth";

function SetupProfile() {
    const { auth } = useAuth();

    return (<>
        <span>{`Welcome, ${auth.username}!`}</span>
        <ProfileComponent
            redirectOnSuccess={true}
        />
    </>)
}

export default SetupProfile;