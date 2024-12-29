import { useState } from "react";
import TwistLife from "../class/TwistLifeFeClass";
import "./RegForm.css";
import logo from '../assets/logo.svg';

export function RegForm({ setUser, setUserData }: { setUser: (value: boolean) => void, setUserData: (value: any) => void }) {
    const [popup, setPopup] = useState<'success' | 'error' | null>(null);


    const handleRegSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formUserData = new FormData(event.currentTarget); 

        const userToReg = {     

            email: formUserData.get('email') as string, 
            password: formUserData.get('password') as string,
            firstname: formUserData.get('firstname') as string,
            lastname: formUserData.get('lastname') as string,
            age: Number(formUserData.get('age')),  
            phone: formUserData.get('phone') as string
        }

        try {

            if (userToReg.age >= 65) {

                const response = await TwistLife.registerUser(userToReg) 

                setPopup('success');

                setUserData(response)

                setTimeout(() => {
                    setUser(true);;
                }, 2999);


                setTimeout(() => {
                    setPopup(null);
                }, 3000);

            }
            else {
                setPopup('error');  
                setTimeout(() => {
                    setPopup(null);
                }, 3000);
                throw new Error("Yor age has to be over 65 years old, sorry you are not qualified for registration");
            }




        }

        catch (err) {
            console.error("Registrace neúspěšná:", err);

            setPopup('error');

            setTimeout(() => {
                setPopup(null);
            }, 3000);


        }



    }

    return (
        <div className="register-container">
            <img src={logo} alt="Twist Life Logo" style={{ width: '300px', marginBottom: '20px', marginLeft: 'auto', marginRight: 'auto', display: 'block' }} />
            <h2 className="register-title">REGISTER WITH US</h2>
            <form className="register-form" onSubmit={handleRegSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        name="firstname"
                        placeholder="First name"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="lastname"
                        placeholder="Last name"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone number"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        placeholder="Your email"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="number"
                        name="age"
                        min={65}
                        placeholder="Age"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                    />
                </div>
                <button type="submit">Confirm</button>
            </form>
            <div className="disclaimer">
            Please note: This service is exclusively for users aged 65 and above. TwistLife is operated by TwistLife inc Sillicon Valley CA 
            </div>
            {popup && (
                <div className={`popup-message ${popup === 'success' ? 'popup-success' : 'popup-error'}`}>
                    {popup === 'success' ? '❤️ REGISTRATION SUCCESSFUL ❤️' : '❌ REGISTRATION FAILED ❌'}
                </div>
            )}
        </div>
    );
}