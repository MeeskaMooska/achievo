'use client'

import styles from './page.module.css'
import { useState } from 'react'
import { ProfileAccessContainer, SignInForm, LoadingContainer } from './components'
import axios from 'axios'
import { useRouter } from 'next/navigation'

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

    async function handleSignInSubmit(e) {
        setIsLoading(true)
        e.preventDefault();
        const user = {
            account_identifier: accountIdentifier,
            password: password,
        };
        console.log(user)
        await axios.post('/.netlify/functions/signInHandler', user)
            .then(response => {
                console.log(response.data);
                router.push('../dashboard')
            })
            .catch(error => {
                console.error(error.error);
            })
    }

    return (
        isLoading ? <div className={styles.container}><LoadingContainer /></div> :
        <div className={styles.container}>
            <ProfileAccessContainer>
                <SignInForm handleIdentifier={handleAccountIdentifierChange}
                    handlePassword={handlePasswordChange}
                    handleSubmit={handleSignInSubmit} />
                <a href="../forgot">Forgot email or password?</a>
            </ProfileAccessContainer>
        </div>
    );
}
