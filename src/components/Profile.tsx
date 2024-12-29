import { useEffect, useState } from "react";
import TwistLife from "../class/TwistLifeFeClass";
import { UserProfile } from '../types/interfaces';
import "./Profile.css";

export function Profile({ userData, setCompletedUserProfile, onFindFriends, openInbox, messageCount }: { 
    userData: any, 
    setCompletedUserProfile: (value: UserProfile) => void, 
    onFindFriends: () => void, 
    openInbox: () => void,
    messageCount: number
}) {
    const [profileData, setProfileData] = useState<UserProfile | null>(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const userProfile = await TwistLife.getUserProfile(userData.email);
                setProfileData(userProfile);
                setCompletedUserProfile(userProfile);
            } catch (error) {
                console.error("Error loading profile:", error);
            }
        };

        loadProfile();
    }, [userData.email]);

    return (
        <div className="profile-container">
            <div className="profile-header">
                <button className={`inbox-button ${messageCount > 0 ? 'has-messages' : ''}`} onClick={openInbox}>✉️</button>
            </div>

            <h3 className="profile-title">
                👋 Welcome {profileData?.firstname}, this is your profile!
                You are ready to find friends near you!
            </h3>

            <div className="profile-section">
                <h4 className="section-heading">Basic Information</h4>
                <p className="info-text">
                    You are {profileData?.age} years old and looking for {profileData?.lookingFor} with {profileData?.interestedIn}.
                    {profileData?.pets !== 'none' ? 
                        ` You have a ${profileData?.pets} as a pet` : 
                        " You don't have any pets"}
                    {profileData?.children ? 
                        " and you have children" : 
                        " and you don't have children"}.
                </p>
            </div>

            <div className="profile-section">
                <h4 className="section-heading">Interests & Hobbies</h4>
                <p className="info-text">
                    Your star sign is {profileData?.starSign} and you enjoy watching: {profileData?.movieGenre.map((genre, index) => (
                        <span key={index}>
                            {genre}{index < profileData.movieGenre.length - 1 ? ', ' : ''}
                        </span>
                    ))}
                </p>
            </div>

            <div className="profile-section">
                <h4 className="section-heading">About Me</h4>
                <p className="info-text">
                    Your last job was {profileData?.lastJob}, and you told us: "{profileData?.aboutme}"
                </p>
            </div>

            {profileData?.photos && profileData.photos.length > 0 && (
                <div className="profile-section">
                    <h4 className="section-heading">Your Photos</h4>
                    <div className="photos-grid">
                        {profileData.photos.map((photo, index) => (
                            <img 
                                key={index}
                                src={`http://localhost:3010/${photo}`}
                                alt={`Photo ${index + 1}`}
                                className="profile-photo"
                            />
                        ))}
                    </div>
                </div>
            )}

            <button className="action-button" onClick={onFindFriends}>
                FIND NEW FRIENDS
            </button>
        </div>
    );
}