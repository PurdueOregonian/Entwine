import ProfileComponent from "../components/ProfileComponent";
import useAuth from "../hooks/useAuth";

function SetupProfile() {
    const { auth } = useAuth();
    <span>{`Welcome, ${auth.username}!`}</span>
    return <ProfileComponent />
}

export default SetupProfile;