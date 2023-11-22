'use client'

import styles from './page.module.css'
import { useState } from 'react'
import { ProfileAccessContainer, SignInForm, SignUpForm, LoadingContainer, TabSelectorContainer } from '../accountAccessComponents/components.js'
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
    const [isSignIn, setIsSignIn] = useState(true);
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
        console.log(e.target.id)
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
                <TabSelectorContainer handleTabSelectorClick={handleTabSelectorClick} />
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
