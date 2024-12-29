import React, { useState } from "react";
import './ProfileForm.css';
import TwistLife from "../class/TwistLifeFeClass";

type UserLocation = {
    latitude: string;
    longitude: string;
}

export function ProfileForm({ userStatus, userData, setUserProfileCollected}: {
    userStatus: boolean,
    userData: any,
    setUserProfileCollected: (value: boolean) => void,
    
}) {
    const [formState, setFormState] = useState<'first' | 'second' | 'third'>('first');
    const [zipError, setZipError] = useState<string | null>(null);
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const [userPhotos, setUserPhotos] = useState<File[]>([]);

    const isValidZipCode = (zipCode: string) => {
        const zipRegex = /^\d{5}$/;
        return zipRegex.test(zipCode);
    }

    const handleTownSearch = async (e: React.MouseEvent) => {
        e.preventDefault();
        const zipCode = (document.querySelector('input[name="zipCode"]') as HTMLInputElement).value;

        if (!isValidZipCode(zipCode)) {
            setZipError('ZIP CODE INVALID, PUT 5 NUMBERS');
            return;
        }

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?` +
                `postalcode=${encodeURIComponent(zipCode)}` +
                `&format=json` +
                `&limit=1`
            );

            const data = await response.json();

            if (data.length > 0) {
                setUserLocation({
                    latitude: data[0].lat,
                    longitude: data[0].lon
                });
                setZipError(null);
            } else {
                setZipError('Location not found');
            }
        } catch (err) {
            console.log("error searching location:", err);
            setZipError('Error finding location');
        }
    }

    const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const dataFromInputs = new FormData(event.currentTarget);

        if (!userLocation) {
            setZipError('Please verify your location first');
            return;
        }

        const movieGenres = Array.from(dataFromInputs.getAll('movie')) as string[];
        console.log("Selected genres:", movieGenres);

        if (movieGenres.length === 0) {
            alert("Please select at least one movie genre");
            return;
        }

        const profileData = {
            ...userData,
            interestedIn: dataFromInputs.get('meet') as string,
            location: userLocation,
            lookingFor: dataFromInputs.get('looking4') as string,
            pets: dataFromInputs.get('pets') as string,
            children: dataFromInputs.get('children') === 'yes',
            starSign: dataFromInputs.get('star') as string,
            movieGenre: movieGenres,
            lastJob: dataFromInputs.get('job') as string,
            aboutme: dataFromInputs.get('aboutme') as string,
            photos: userPhotos
        }

        const { photos, ...profileDataWithoutPhotos } = profileData;

        const formData = new FormData();
        formData.append('userProfileData', JSON.stringify(profileDataWithoutPhotos));

        if (!userPhotos || userPhotos.length === 0) {
            alert("Please upload at least one photo");
            return;
        }

        userPhotos.forEach((photo) => {
            formData.append('photos', photo);
        });

        try {
            const response = await TwistLife.createUserProfile(formData);
            console.log("Server response:", response);
            setUserProfileCollected(true);
        } catch (err) {
            console.error("Error creating profile:", err);
            alert("Profile creation failed. Please try again.");
        }
    }

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        setFormState('second');
    }

    const handleNextLastPage = (e: React.MouseEvent) => {
        e.preventDefault();
        setFormState('third');
    }

    const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const uploadedPhotos = e.target.files;
        const uploadedPhotosArr = Array.from(uploadedPhotos || []);

        if (uploadedPhotos !== null &&
            uploadedPhotos.length >= 1 &&
            uploadedPhotos.length <= 3 &&
            uploadedPhotosArr.every(item =>
                item.name.endsWith('.jpg') ||
                item.name.endsWith('.jpeg') ||
                item.name.endsWith('.png')
            )) {
            setUserPhotos(uploadedPhotosArr);
        } else {
            alert("Please check that you uploaded 1-3 photos in JPG or PNG format");
        }
    }

    return (
        <div className="form-container">
            <form onSubmit={submitForm}>
                {/* První sekce */}
                <div className={`form-section ${formState === 'first' ? 'visible' : ''}`}>
                    <div className="welcome-message">
                        Welcome {userData.firstname} to Twist Life! You are successfully {userStatus ? "registered" : "not registered"} ❤️
                        <p>Your journey to find new friends already started! Please tell us about yourself, so we can find you lots of new friends.</p>
                    </div>
     
                    <div className="input-group">
                        <p>🤗 Who would you like to meet?</p>
                        <div className="options-group">
                            <label>
                                <input type="radio" name="meet" value="men" required />
                                men
                            </label>
                            <label>
                                <input type="radio" name="meet" value="women" />
                                women
                            </label>
                            <label>
                                <input type="radio" name="meet" value="everyone" />
                                everyone
                            </label>
                        </div>
                    </div>
     
                    <div className="input-group">
                        <p>🤔 You looking for friends or relationship?</p>
                        <div className="options-group">
                            <label>
                                <input type="radio" name="looking4" value="relationship" required />
                                relationship
                            </label>
                            <label>
                                <input type="radio" name="looking4" value="friends" />
                                friends
                            </label>
                        </div>
                    </div>
     
                    <div className="input-group">
                        <p>🐶 Do you have any pets?</p>
                        <div className="options-group">
                            <label>
                                <input type="radio" name="pets" value="dog" required />
                                dog
                            </label>
                            <label>
                                <input type="radio" name="pets" value="cat" />
                                cat
                            </label>
                            <label>
                                <input type="radio" name="pets" value="other" />
                                other
                            </label>
                            <label>
                                <input type="radio" name="pets" value="none" />
                                none
                            </label>
                        </div>
                    </div>
     
                    <div className="input-group">
                        <p>👱🏼‍♂️ What about children?</p>
                        <div className="options-group">
                            <label>
                                <input type="radio" name="children" value="yes" required />
                                yes
                            </label>
                            <label>
                                <input type="radio" name="children" value="no" />
                                no
                            </label>
                        </div>
                    </div>
     
                    <div className="input-group">
                        <p>🔮 And your starsign is?</p>
                        <div className="options-group">
                            <label>
                                <input type="radio" name="star" value="aries" required />
                                aries
                            </label>
                            <label>
                                <input type="radio" name="star" value="taurus" />
                                taurus
                            </label>
                            <label>
                                <input type="radio" name="star" value="gemini" />
                                gemini
                            </label>
                            <label>
                                <input type="radio" name="star" value="cancer" />
                                cancer
                            </label>
                            <label>
                                <input type="radio" name="star" value="leo" />
                                leo
                            </label>
                            <label>
                                <input type="radio" name="star" value="virgo" />
                                virgo
                            </label>
                            <label>
                                <input type="radio" name="star" value="libra" />
                                libra
                            </label>
                            <label>
                                <input type="radio" name="star" value="scorpio" />
                                scorpio
                            </label>
                            <label>
                                <input type="radio" name="star" value="sagittarius" />
                                sagittarius
                            </label>
                            <label>
                                <input type="radio" name="star" value="capricorn" />
                                capricorn
                            </label>
                            <label>
                                <input type="radio" name="star" value="aquarius" />
                                aquarius
                            </label>
                            <label>
                                <input type="radio" name="star" value="pisces" />
                                pisces
                            </label>
                        </div>
                    </div>
     
                    <div className="form-navigation">
                        <button onClick={handleNext}>NEXT</button>
                    </div>
                </div>
     
                {/* Druhá sekce */}
                <div className={`form-section ${formState === 'second' ? 'visible' : ''}`}>
                    <div className="welcome-message">
                        🤝 Thank you for provided information! Tell us little bit more about your habits and where are you from.
                    </div>
     
                    <div className="input-group">
                        <p>🎬 Which movie genre you like most?</p>
                        <div className="options-group">
                            <label>
                                <input type="checkbox" name="movie" value="action" />
                                Action
                            </label>
                            <label>
                                <input type="checkbox" name="movie" value="comedy" />
                                Comedy
                            </label>
                            <label>
                                <input type="checkbox" name="movie" value="drama" />
                                Drama
                            </label>
                            <label>
                                <input type="checkbox" name="movie" value="horror" />
                                Horror
                            </label>
                            <label>
                                <input type="checkbox" name="movie" value="scifi" />
                                Sci-Fi
                            </label>
                            <label>
                                <input type="checkbox" name="movie" value="romance" />
                                Romance
                            </label>
                            <label>
                                <input type="checkbox" name="movie" value="thriller" />
                                Thriller
                            </label>
                            <label>
                                <input type="checkbox" name="movie" value="documentary" />
                                Documentary
                            </label>
                            <label>
                                <input type="checkbox" name="movie" value="animation" />
                                Animation
                            </label>
                            <label>
                                <input type="checkbox" name="movie" value="fantasy" />
                                Fantasy
                            </label>
                        </div>
                    </div>
     
                    <div className="input-group">
                        <p>💼 What was or is your last profession?</p>
                        <div className="options-group">
                            <label>
                                <input type="radio" name="job" value="Teacher" required />
                                Teacher
                            </label>
                            <label>
                                <input type="radio" name="job" value="Doctor" />
                                Doctor
                            </label>
                            <label>
                                <input type="radio" name="job" value="Engineer" />
                                Engineer
                            </label>
                            <label>
                                <input type="radio" name="job" value="Nurse" />
                                Nurse
                            </label>
                            <label>
                                <input type="radio" name="job" value="Lawyer" />
                                Lawyer
                            </label>
                            <label>
                                <input type="radio" name="job" value="Chef" />
                                Chef
                            </label>
                            <label>
                                <input type="radio" name="job" value="Police Officer" />
                                Police Officer
                            </label>
                            <label>
                                <input type="radio" name="job" value="Salesperson" />
                                Salesperson
                            </label>
                            <label>
                                <input type="radio" name="job" value="Accountant" />
                                Accountant
                            </label>
                            <label>
                                <input type="radio" name="job" value="Software Developer" />
                                Software Developer
                            </label>
                            <label>
                                <input type="radio" name="job" value="Plumber" />
                                Plumber
                            </label>
                            <label>
                                <input type="radio" name="job" value="Electrician" />
                                Electrician
                            </label>
                            <label>
                                <input type="radio" name="job" value="Artist" />
                                Artist
                            </label>
                            <label>
                                <input type="radio" name="job" value="Scientist" />
                                Scientist
                            </label>
                            <label>
                                <input type="radio" name="job" value="Architect" />
                                Architect
                            </label>
                            <label>
                                <input type="radio" name="job" value="Dentist" />
                                Dentist
                            </label>
                            <label>
                                <input type="radio" name="job" value="Writer" />
                                Writer
                            </label>
                            <label>
                                <input type="radio" name="job" value="Farmer" />
                                Farmer
                            </label>
                            <label>
                                <input type="radio" name="job" value="Driver" />
                                Driver
                            </label>
                            <label>
                                <input type="radio" name="job" value="Hairdresser" />
                                Hairdresser
                            </label>
                            <label>
                                <input type="radio" name="job" value="Construction Worker" />
                                Construction Worker
                            </label>
                            <label>
                                <input type="radio" name="job" value="Marketing Manager" />
                                Marketing Manager
                            </label>
                            <label>
                                <input type="radio" name="job" value="Pilot" />
                                Pilot
                            </label>
                            <label>
                                <input type="radio" name="job" value="Banker" />
                                Banker
                            </label>
                            <label>
                                <input type="radio" name="job" value="Real Estate Agent" />
                                Real Estate Agent
                            </label>
                            <label>
                                <input type="radio" name="job" value="Manager" />
                                Manager
                            </label>
                            <label>
                                <input type="radio" name="job" value="Entrepreneur" />
                                Entrepreneur
                            </label>
                            <label>
                                <input type="radio" name="job" value="Web Developer" />
                                Web Developer
                            </label>
                            <label>
                                <input type="radio" name="job" value="Pharmacist" />
                                Pharmacist
                            </label>
                            <label>
                                <input type="radio" name="job" value="Consultant" />
                                Consultant
                            </label>
                            <label>
                                <input type="radio" name="job" value="Other" />
                                Other
                            </label>
                        </div>
                    </div>
     
                    <div className="zip-code-container">
                        <p>Please enter your ZIP code:</p>
                        <div className="zip-input-group">
                            <input
                                type="text"
                                name="zipCode"
                                placeholder="ZIP code"
                                maxLength={5}
                                required
                            />
                            <button type="button" onClick={handleTownSearch}>
                                VERIFY LOCATION
                            </button>
                        </div>
                        {zipError && <p className="warning-message">{zipError}</p>}
                        {userLocation && <p className="success-message">✅ Location verified</p>}
                    </div>
     
                    <div className="input-group">
                        <p>✍️ You want tell us more about you?</p>
                        <textarea
                            name="aboutme"
                            required
                            maxLength={300}
                            placeholder="Write something about yourself (max 300 characters)..."
                            className="about-textarea"
                        />
                    </div>
     
                    <div className="form-navigation">
                        <button type="button" onClick={handleNextLastPage}>NEXT</button>
                    </div>
                </div>
     
                {/* Třetí sekce */}
                <div className={`form-section ${formState === 'third' ? 'visible' : ''}`}>
                    <div className="welcome-message">
                        We are almost there! 📷 Let's upload 1-3 photos of yourself and you are all set up
                    </div>
     
                    <div className="photo-upload-container">
                        <p>Please upload your photos (1-3 photos)</p>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleUploadPhoto}
                            max="3"
                            className="file-input"
                        />
     
                        <div className="uploaded-photos-status">
                            {userPhotos.length > 0 ? (
                                <p className="success-message">
                                    ✅ {userData.firstname} you successfully uploaded {userPhotos.length} photos
                                </p>
                            ) : (
                                <p>no photos uploaded yet</p>
                            )}
                        </div>
                    </div>
     
                    <div className="form-navigation">
                        <button type="submit">SAVE PROFILE</button>
                    </div>
                </div>
            </form>
        </div>
     )
}