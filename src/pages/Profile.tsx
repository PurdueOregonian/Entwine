import NavHeader from "../components/NavHeader";
import ProfileComponent from "../components/ProfileComponent";

function Profile() {
    return (
        <>
            <NavHeader />
            <ProfileComponent
                redirectOnSuccess={false}
            />
        </>
    );
}

export default Profile;