export interface User {
    id?: string;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    age: number;
    phone: string;
}
export type moviesPick = 'action' | 'comedy' | 'drama' | 'horror' | 'scifi' | 'romance' | 'thriller' | 'documentary' | 'animation' | 'fantasy'; // vytvářím vlastní datový typ které může mít hodnotu pouze výše uvedenou

export interface UserProfile extends User { // UserProfile dědí vlastnosti přímo z userObjektu, jde o interface extension
    interestedIn: 'men' | 'women' | 'everyone', // union type
    location: String,
    lookingFor: 'friends' | 'relationship' | 'both',
    pets: 'dog' | 'cat' | 'other' | 'none',
    children: boolean,
    starSign: 'aries' | 'cancer' | 'libra' | 'capricorn' | 'taurus' | 'leo' | 'scorpio' | 'aquarius' | 'gemini' | 'virgo' | 'sagittarius' | 'pisces'
    movieGenre: moviesPick[], // zde tvrdím, že půjde o pole ve kterém budou pouze datové typy MoviesPick
    lastJob: 'Teacher' | 'Doctor' | 'Engineer' | 'Nurse' | 'Lawyer' | 'Chef' | 'Police Officer' | 'Salesperson' | 'Accountant' | 'Software Developer' | 'Plumber' | 'Electrician' | 'Artist' | 'Scientist' | 'Architect' | 'Dentist' | 'Writer' | 'Farmer' | 'Driver' | 'Hairdresser' | 'Construction Worker' | 'Marketing Manager' | 'Pilot' | 'Banker' | 'Real Estate Agent' | 'Manager' | 'Entrepreneur' | 'Web Developer' | 'Pharmacist' | 'Consultant' | 'Other',
    aboutme: string,
    photos: string[]
}
export interface Message {
    id: string,
    senderEmail: string,
    senderFirstname: string,
    senderLastname: string,
    receiverEmail: string,
    content: string,
    timestamp: string

}