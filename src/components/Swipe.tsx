import  { useEffect, useState } from "react";
import TwistLife from "../class/TwistLifeFeClass";
import { UserProfile } from "../types/interfaces";
import "./Swipe.css";
import { Message } from "../types/interfaces";

export function Swipe({ openInbox, userData, onMessageSent, messageCount }: { openInbox: () => void, userData: UserProfile | null, onMessageSent: (Message: Message) => void, messageCount: number }) {
    const [meetProfile, setMeetProfile] = useState<UserProfile | null>(null);
    const [modalSayHi, setModalSayHi] = useState<boolean>(false);
    const [messageText, setMessageText] = useState('');
    

    useEffect(() => {
        const loadProfiles = async () => {
            const firstProfile = await TwistLife.getProfileToSwipe();
            setMeetProfile(firstProfile)
        }
        loadProfiles();
    }, []);

    const loadNextProfile = async () => {
        const nextProfile = await TwistLife.getProfileToSwipe();
        setMeetProfile(nextProfile)
    };

    const loadModal = () => {
        setModalSayHi(true)
    }

    const handleSendMessage = async () => {
        if (!meetProfile?.email || !messageText.trim() || !userData) {
            return;
        }

        try {
            const messageToSend = await TwistLife.sendMessage({
                id: crypto.randomUUID(),
                senderEmail: userData.email,
                senderFirstname: userData.firstname,
                senderLastname: userData.lastname,
                receiverEmail: meetProfile?.email,
                content: messageText,
                timestamp: new Date().toISOString()
            });
            onMessageSent(messageToSend);

            setMessageText('');
        }

        catch (error) {
            console.error('Sending message unsuccesfull', error);
            
        }

    }

    return (
        <div className="swipe-container">
            {meetProfile ? (
                <>
                    <div className="profile-header">
                        <button className={`inbox-button ${messageCount > 0 ? 'has-messages' : ''}`} onClick={openInbox}>✉️</button>
                    </div>

                    <h3 className="profile-title">
                        Hi, this is {meetProfile?.firstname} very wonderfull person, who  would like to meet with you! 
                    </h3>

                    <div className="profile-details">
                        {meetProfile?.firstname} is {meetProfile?.age} old and is looking for {meetProfile?.lookingFor}.
                    </div>

                    <div className="profile-details">
                        {meetProfile?.firstname}'s starsign is {meetProfile?.starSign}.
                        Would you enjoy watching these movies together: {meetProfile?.movieGenre.map((genre, index) => (
                            <span key={index}>
                                {genre}{index < meetProfile.movieGenre.length - 1 ? ', ' : ''}
                            </span>
                        ))}?
                    </div>

                    <div className="profile-details">
                        {meetProfile?.firstname}'s last job was {meetProfile?.lastJob}, and here is what this amazing person says about themselelf: "{meetProfile?.aboutme}"
                    </div>

                    <div className="photo-section">
                        <h4>Photos</h4>
                        <div className="photos-container">
                            {meetProfile?.photos.map((photo, index) => (
                                <img
                                    key={index}
                                    src={photo}
                                    alt={`Photo ${index + 1}`}
                                    className="profile-photo"
                                    style={{ maxWidth: '200px', margin: '10px' }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button className="action-button" onClick={() => loadModal()}>👋SAY HI</button>
                        <button className="action-button" onClick={() => loadNextProfile()}>❌</button>
                        <button className="action-button" onClick={() => loadNextProfile()}>NEXT</button>
                    </div>

                    <div>
                        {modalSayHi && (
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <h3>Send a message to {meetProfile?.firstname}</h3>
                                    <textarea
                                        value={messageText}
                                        placeholder="Write your message..."
                                        onChange={(e) => setMessageText(e.target.value)}
                                    
                                    ></textarea>
                                    <div className="modal-buttons">
                                        <button onClick={() => setModalSayHi(false)}>Cancel</button>
                                        <button onClick={handleSendMessage}>Send</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="loading-message">Loading Profile...</div>
            )}
        </div>
    );
}