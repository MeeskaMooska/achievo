'use client'

import styles from './page.module.css';
import { ProfileSidebar, AccountDetailsBox } from './components.js';
import Link from 'next/link'
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
    const [userInfo, setuserInfo] = useState({username: 'loading...', email: 'loading...'});
    const [changingEmail, setchangingEmail] = useState(false);

    // Email change
    const [newEmail, setnewEmail] = useState('');
    const [passwordConfirmation, setpasswordConfirmation] = useState('');

    useEffect(() => {
        async function validateUserToken() {
            await axios.get('../.netlify/functions/verifyToken', { withCredentials: true })
                .then((response) => {
                    // Valid token - redirect to dashboard or perform actions
                    console.log('Token Authenticated, hello ' + response.data.username);

                    setuserInfo(response.data);
                })
                .catch((error) => {
                    // Not a valid token - handle the error
                    console.error('Error from server:', error.response.data.error);
                });
        }

        validateUserToken();
    }, []);

    // Email change
    const handleEmailChangeInput = (e) => {
        setnewEmail(e.target.value);
    }

    const handlePasswordConfirmationInput = (e) => {
        setpasswordConfirmation(e.target.value);
    }

    const handleEmailChangeClick = (e) => {
        e.target.innerHTML = changingEmail ? 'Change' : 'Cancel'
        setchangingEmail(!changingEmail);
    }

    async function handleEmailChange(e) {
        console.log('Email change initiated.')
        let emailUpdated = false;
        let newEmailSuccess = false;
        let data = {
            userId: userInfo.id,
            email: newEmail,
            password: passwordConfirmation
        }

        await axios.post('../.netlify/functions/changeEmail', data)
            .then(response => {
                emailUpdated = true;
            })
            .catch(error => {
                console.error(error);
            })

        console.log('Email updated.')

        if (emailUpdated) {
            data = {
                email: newEmail,
                username: userInfo.username
            }

            await axios.post('../.netlify/functions/newEmailSender', data)
                .then(response => {
                    newEmailSuccess = true;
                })
                .catch(error => {
                    console.error(error);
                })
        }
        console.log('Email 1 sent.')

        if (newEmailSuccess) {
            data = {
                userId: userInfo.id,
                email: userInfo.email,
                username: userInfo.username
            }
            console.log("here")
            await axios.post('../.netlify/functions/previousEmailSender', data)
                .then(response => {
                    console.log('Email change success.');
                })
                .catch(error => {
                    console.error(error);
                })
        }

        console.log('Email change complete.')
    }
    return (
        <div className={styles.profileBox}>
            <Link href="../dashboard" className={styles.dashboardLink}>&#8592; My dashboard.</Link>
            <AccountDetailsBox>
                <div className={styles.infoColumn}>
                    <div className={styles.infoContainer}>
                        <p className={styles.infoIdentifier}>Username:</p>
                        <p className={styles.info}>{userInfo.username}</p>
                    </div>
                    <div className={styles.infoContainer}>
                        <p className={styles.infoIdentifier}>Email:</p>
                        <div className={styles.changeableContainer}>
                            <p className={styles.info}>{userInfo.email}</p>
                            <button className={styles.changeButton} onClick={handleEmailChangeClick}>Change</button>
                        </div>
                    </div>
                    <div className={styles.infoChangeContainer} style={changingEmail ? {display: 'block'} : {display: 'none'}}>
                        <input type="text" className={styles.infoChangeInput} 
                        onChange={handleEmailChangeInput}
                        placeholder="New email address"></input>
                        <input type="text" className={styles.infoChangeInput} 
                        onChange={handlePasswordConfirmationInput}
                        placeholder="Password confirmation."></input>
                        <button className={styles.infoChangeButton} onClick={handleEmailChange}>Confirm</button>
                    </div>
                    <div className={styles.infoContainer}>
                        <p className={styles.infoIdentifier}>Password:</p>
                        <div className={styles.changeableContainer}>
                            <p className={styles.info}>••••••••</p>
                            <button className={styles.changeButton}>Change</button>
                        </div>
                    </div>
                </div>
                <label htmlFor="sessionLengthPref" className={styles.optionsLabel}>Preferred session length (how long you're signed in):</label>
                <select id="sessionLengthPref" className={styles.profileOption}>
                    <option value="1d">1 Day</option>
                    <option value="3d">3 Days</option>
                    <option value="7d">1 Week</option>
                    <option value="30d">1 Month</option>
                    <option value="90d">3 Months</option>
                    <option value="365d">12 Months</option>
                </select>
                <div className={styles.applyDiscardContainer}>
                    <button>Apply</button>
                    <button>Discard</button>
                </div>
            </AccountDetailsBox>
        </div>
    )
}