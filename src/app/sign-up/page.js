'use client'

import styles from './page.module.css'
import { useState } from 'react'

export default function App() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleEmailChange = (event) => { 
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevents the default form submission
    
        const user = {
            username: username,
            email: email,
            password: password,
        };
    
        try {
            const response = await fetch ('../../.netlify/functions/createUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user)
            });
    
            const data = await response.json();
    
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="centered" id={styles.wideDiv}>
            <form className={styles.wideForm} onSubmit={handleSubmit}>
                <label htmlFor="username_input">Username:</label>
                <input className={styles.input} type="text" placeholder='Username'
                    onChange={handleUsernameChange} name="username_input" id="username_input" required></input>
                <label htmlFor="username_input" >Email:</label>
                <input className={styles.input} type="email" placeholder='Email'
                    onChange={handleEmailChange} name="email_input" id="email_input" required></input>
                <label htmlFor="username_input">Password:</label>
                <input className={styles.input} type="password" placeholder='Password' 
                    onChange={handlePasswordChange} name="password_input" id="password_input" required></input>
                <input type="submit" style={{width: '100%', padding: 10, boxSizing: 'content-box'}}></input>
            </form>
            <a href="/sign-in">Already have an account? Login.</a>
        </div>
    )
}