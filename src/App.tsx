import { useState } from 'react'
import { ProfileForm } from './components/ProfileForm'

import { Profile } from './components/Profile'
import { Swipe } from './components/Swipe'
import { RegForm } from './components/RegForm'
import { UserProfile, Message } from './types/interfaces'
import { Inbox } from './components/Inbox'
import './styles/global.css'


function App() {

  const [userRegistered, setUserRegistered] = useState(false);

  const [userData, setUserData] = useState<UserProfile | null>(null);

  const [userProfileCollected, setUserProfileCollected] = useState(false);

  const [completedUserProfile, setCompletedUserProfile] = useState<UserProfile | null >(null);

  const [swiping, setSwiping] = useState(false);

  const [showInbox, setShowInbox] = useState(false);

  const [newMessage, setNewMessage] = useState<Message | null>(null);

  const [messageCount, setMessageCount] = useState<number>(0);


  console.log(completedUserProfile);

  const startSwiping = () => {
    setSwiping(true)
  }

  const handleNewMessage = (message: Message) => {
    setNewMessage(message);
  };

  const handleMessageCount = (count: number) => {
    setMessageCount(count);
  };


  const renderContent = () => {
    if (!userRegistered) {
      return (
      
        <RegForm setUser={setUserRegistered} setUserData={setUserData}/>
      )}

    if (!userProfileCollected) {
      return(
        <ProfileForm userStatus={userRegistered} userData={userData} setUserProfileCollected={setUserProfileCollected}/>
      
    )}
    if (showInbox) {
      return (
        <Inbox currentUser={userData}
        closeInbox={() => setShowInbox(false)}
        onMessageSent={handleNewMessage}
        newMessage={newMessage}
        handleHasMessages={handleMessageCount} />
      )
    }

    if (userRegistered && userProfileCollected && !swiping) {

      return (
        <Profile userData={userData} setCompletedUserProfile={setCompletedUserProfile} onFindFriends={startSwiping} openInbox={() => setShowInbox(true)}
        messageCount={messageCount}/>

      )}
      
    if (swiping) {
      return (
        <Swipe openInbox={() => setShowInbox(true)} userData={userData} onMessageSent={handleNewMessage} messageCount={messageCount} />
      )
    }
    
    
  }  

  return (
    <div className='app-container'>
      {renderContent()}
    </div>
  )
}

export default App
