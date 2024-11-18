'use client'

import styles from './page.module.css'
import { useEffect, useState } from 'react'
import { ProfileAccessContainer, SignInForm, SignUpForm, LoadingContainer, TabSelectorContainer } from '../accountAccessComponents/components'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import componentStyle from '../accountAccessComponents/components.module.css'

export default function App() {
    const router = useRouter()

    // Sign up states
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    // Sign in states
    const [accountIdentifier, setAccountIdentifier] = useState('');

    // Global state
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSignIn, setIsSignIn] = useState(false);
    const [errorText, setErrorText] = useState('');

    const handleAccountIdentifierChange = (event) => {
        setAccountIdentifier(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handleTabSelectorClick = (e) => {
        if (e.target.id === 'tab-selector-0') {
            document.getElementById('tab-selector-0').classList.add(componentStyle.active)
            document.getElementById('tab-selector-1').classList.remove(componentStyle.active)
            setIsSignIn(true)
        } else {
            document.getElementById('tab-selector-1').classList.add(componentStyle.active)
            document.getElementById('tab-selector-0').classList.remove(componentStyle.active)
            setIsSignIn(false)
        }
    }

    async function handleSignInSubmit(e) {
        setIsLoading(true)
        e.preventDefault();
        const user = {
            account_identifier: accountIdentifier,
            password: password,
        };

        await axios.post('/.netlify/functions/signInHandler', user)
            .then(response => {
                console.log(response.data);
                router.push('../dashboard')
            })
            .catch(error => {
                setIsLoading(false)
                if (error.response) {
                    console.error('Error: ' + error.response.data.error);
                    console.error('Status: ' + error.response.status);
                    setErrorText('Error: ' + error.response.data.error)
                } else if (error.request) {
                    console.error('Error recieving response: ' + error.request);
                    setErrorText('Error recieving response: ' + error.request)
                }
            })
    }

    async function handleSignUpSubmit(e) {
        setIsLoading(true)
        e.preventDefault();
        const user = {
            username: username,
            email: email,
            password: password,
        };

        // Checks username validity
        // Username cannot be over 16 chars long, cannot contain special characters, and cannot contain spaces
        const usernameRegex = /^[a-zA-Z0-9_]{1,16}$/;
        if (!usernameRegex.test(username)) {
            setIsLoading(false)
            setErrorText('Username does not meet requirements.')
            return;
        }

        // Checks password strength
        // Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*-_])[A-Za-z\d!@#$%^&*-_]{8,32}$/;
        if (!passwordRegex.test(password)) {
            setIsLoading(false)
            setErrorText('Password does not meet requirements.')
            return;
        }

        await axios.post('/.netlify/functions/signUpHandler', user)
            .then(response => {
                console.log('Response: ' + response);
                router.push('../dashboard')
            })
            .catch(error => {
                setIsLoading(false)
                if (error.response) {
                    console.error('Error: ' + error.response.data.error);
                    console.error('Status: ' + error.response.status);
                    setErrorText('Error: ' + error.response.data.error)
                } else if (error.request) {
                    console.error('Error recieving response: ' + error.request);
                    setErrorText('Error recieving response: ' + error.request)
                }
            })
    }

    return (
        <div className={styles.container}>
            <ProfileAccessContainer isSignIn={isSignIn}>
                <TabSelectorContainer handleTabSelectorClick={handleTabSelectorClick} isSignIn={false} />
                {isLoading && <LoadingContainer isSignIn={isSignIn}/>}
                {isSignIn ?
                    <SignInForm handleIdentifier={handleAccountIdentifierChange}
                        handlePassword={handlePasswordChange}
                        handleSubmit={handleSignInSubmit} />
                    :
                    <SignUpForm handleUsername={handleUsernameChange}
                        handleEmail={handleEmailChange}
                        handlePassword={handlePasswordChange}
                        handleSubmit={handleSignUpSubmit} />
                }
            </ProfileAccessContainer>
            <p style={{ color: 'rgb(255, 110, 110)' }}>{errorText}</p>
        </div>
    )
}
