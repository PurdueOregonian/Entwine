import NavHeader from "../components/NavHeader";
import EditProfileComponent from "../components/EditProfileComponent";

function Profile() {
    return (
        <>
            <NavHeader />
            <EditProfileComponent
                redirectOnSuccess={false}
            />
        </>
    );
}

export default Profile;