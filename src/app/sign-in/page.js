'use client'

import styles from './page.module.css'
import { useState } from 'react'

export default function App() {
    const [account_identifier, setAccountIdentifier] = useState('');
    const [password, setPassword] = useState('');

    const handleAccountIdentifierChange = (event) => {
        setAccountIdentifier(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const user = {
            account_identifier: account_identifier,
            password: password,
        };

        try {
            const response = await fetch ('.netlify/functions/signInHandler', {
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
        <div className='centered' id={styles.wideDiv}>
            <form className={styles.wideForm} onSubmit={handleSubmit}>
                <label htmlFor="account_identifier_input">Email or Username:</label>
                <input className={styles.input} type="text" placeholder='Email or Username'
                    onChange={handleAccountIdentifierChange} name="account_identifier_input" id="account_identifier_input" required></input>
                <label htmlFor="password_input">Password:</label>
                <input className={styles.input} type="password" placeholder='Password' 
                    onChange={handlePasswordChange} name="password_input" id="password_input" required></input>
                <input type="submit" style={{width: '100%', padding: 10, boxSizing: 'content-box'}}></input>
            </form>
            <a href="/sign-up">Already have an account? Sign Up.</a>
        </div>
    )
}