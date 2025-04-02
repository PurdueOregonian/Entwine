import EditProfileComponent from "../components/EditProfileComponent";
import { useState } from "react";
import UserProfile from "./UserProfile";

type ProfileMode = 'View' | 'Edit';

function Profile() {
    const [profileMode, setProfileMode] = useState<ProfileMode>('View');
    return (
        <>
            <div className="justify-center items-center">
                {profileMode === 'View' && <UserProfile />}
                {profileMode === 'Edit' && <EditProfileComponent
                    redirectOnSuccess={false}
                />}
                <button data-testid="profileModeButton" className="button" type="button" onClick={() => setProfileMode(profileMode === 'View' ? 'Edit' : 'View')}>
                    {profileMode === 'View' ? 'Edit' : 'Back'}
                </button>
            </div>
        </>
    );
}

export default Profile;