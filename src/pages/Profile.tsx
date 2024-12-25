import NavHeader from "../components/NavHeader";
import EditProfileComponent from "../components/EditProfileComponent";
import { useState } from "react";
import UserProfile from "./UserProfile";

type ProfileMode = 'View' | 'Edit';

function Profile() {
    const [profileMode, setProfileMode] = useState<ProfileMode>('View');
    return (
        <>
            <NavHeader />
            <div className="alignVertical center">
                {profileMode === 'View' && <UserProfile />}
                {profileMode === 'Edit' && <EditProfileComponent
                    redirectOnSuccess={false}
                />}
                <button className="button" type="button" onClick={() => setProfileMode(profileMode === 'View' ? 'Edit' : 'View')}>
                    {profileMode === 'View' ? 'Edit' : 'Back'}
                </button>
            </div>
        </>
    );
}

export default Profile;