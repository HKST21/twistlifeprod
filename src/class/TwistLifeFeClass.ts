export const BASE_URL = import.meta.env.PROD 
  ? 'https://twistlife-backend.onrender.com'
  : 'http://localhost:3000';
import { Message } from "../types/interfaces";


interface User {
    id?: string;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    age: number;
    phone: string;
}

/*type moviesPick = 'action' | 'comedy' | 'drama' | 'horror' | 'scifi' | 'romance' | 'thriller' | 'documentary' | 'animation' | 'fantasy'; // 
*/
/*
interface UserProfile extends User { 
    interestedIn: 'men' | 'women' | 'everyone', // union type
    location: String,
    lookingFor: 'friends' | 'relationship' | 'both',
    pets: 'dog' | 'cat' | 'other' | 'none',
    children: boolean,
    starSign: 'aries' | 'cancer' | 'libra' | 'capricorn' | 'taurus' | 'leo' | 'scorpio' | 'aquarius' | 'gemini' | 'virgo' | 'sagittarius' | 'pisces'
    movieGenre: moviesPick[], 
    lastJob: 'Teacher' | 'Doctor' | 'Engineer' | 'Nurse' | 'Lawyer' | 'Chef' | 'Police Officer' | 'Salesperson' | 'Accountant' | 'Software Developer' | 'Plumber' | 'Electrician' | 'Artist' | 'Scientist' | 'Architect' | 'Dentist' | 'Writer' | 'Farmer' | 'Driver' | 'Hairdresser' | 'Construction Worker' | 'Marketing Manager' | 'Pilot' | 'Banker' | 'Real Estate Agent' | 'Manager' | 'Entrepreneur' | 'Web Developer' | 'Pharmacist' | 'Consultant' | 'Other',
    aboutme: string,
    photos: string[] | File[] 
}
*/

export class TwistLifeFeClass {


    async registerUser(userData: User) {

        if (!userData.email || !userData.password || !userData.firstname || !userData.lastname ) {
            throw new Error('Email, password are obligatory');
        }

        try {

            const responseRegUser = await fetch(`${BASE_URL}/api/twistlife/users`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(userData)
            });

            if (!responseRegUser.ok) {
                const errorText = await responseRegUser.text();
                throw new Error(errorText)
            }

            const registeredUser = await responseRegUser.json();

            return registeredUser;

        }

        catch (err) {
            console.log("error in registring user", err)
            throw err;

        }

    }

    async createUserProfile(profileData: FormData) {
        try {
            
            for (let pair of profileData.entries()) {
                console.log(pair[0], pair[1]);
            }
 
            const responseCreateProfile = await fetch(`${BASE_URL}/api/twistlife/userProfiles`, {
                method: "POST",
                body: profileData 
            });
 
            if (!responseCreateProfile.ok) {
                const errorText = await responseCreateProfile.text();
                 
                throw new Error(errorText);
            }
 
            const updatedProfile = await responseCreateProfile.json();
            console.log("Server vrátil profil:", updatedProfile);
            return updatedProfile;
 
        }
        catch (err) {
            console.log("předávání dat z formu na end point selhalo", err);
            throw err; 
        }
    }

    async getUserProfile(email: string) {

        try {
            console.log("Calling getUserProfile with email:", email);

            const response = await fetch(`${BASE_URL}/api/twistlife/userProfiles?email=${email}`); 

            console.log("Response from backend:", response);

            const userProfile = await response.json();

            console.log("Parsed profile:", userProfile);

            return userProfile;

        }

        catch (err) {
            console.error("Error fetching user profile", err);
            
            throw err;

        }
    }

    async getProfileToSwipe()  {

        try {

            const response = await fetch(`${BASE_URL}/api/twistlife/userProfiles/next`);

            const profileToSwipe = await response.json();

            return profileToSwipe;

        }

        catch (err) {
            console.error("Error fetching profile to swipe", err);
            
            throw err;

        }

    };

    async getUserInboxPreview(email: string) : Promise<Message[] | undefined> {
        try {

            const response = await fetch(`${BASE_URL}/api/twistlife/inboxPreview?email=${email}`);

            if (!response.ok) {
                throw new Error('Failed to fetch inbox preview');
            }

            const inboxPreview = await response.json();

            return inboxPreview

        }

        catch (err) {
            console.log("getting user inbox preview wasnt succesfull");
            throw err;
        }
    };

    async sendMessage(messageContent: Message): Promise<Message> {
        try {

            const response = await fetch(`${BASE_URL}/api/twistlife/messages`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(messageContent)
            });

            if (!response.ok) {
                throw new Error("Failed to send message");
                
            }
            
            return await response.json();

        }

        catch (err) {
            console.error('Error sending message', err);
            throw err;
        }
    }

    async getConversationHistory(userEmail: string, otherEmail: string): Promise<Message[]> {
        try {
            const response = await fetch(
                `${BASE_URL}/api/twistlife/messages/conversation?userEmail=${userEmail}&otherEmail=${otherEmail}`
            );
    
            if (!response.ok) {
                throw new Error('Failed to fetch conversation history');
            }
    
            return await response.json();
        } catch (err) {
            console.error("Error getting conversation history:", err);
            throw err;
        }
    }

    

}

export const TwistLife = new TwistLifeFeClass();

export default TwistLife;