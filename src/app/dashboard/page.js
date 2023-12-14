// Version: 1.0.1
'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import styles from './components.module.css'
import { ListViewer, LoadingContainer } from './components'

let details = {};

function handleCardClick(card) {
    details = JSON.parse(card.target.getAttribute('data-details'));
    console.log(details)
    
    document.getElementById('listTitle').innerHTML = details.title;
    document.getElementById('listDescription').innerHTML = details.desc;

    document.getElementById('noListMessage').style.display = 'none';
    document.getElementById('listPreview').style.display = 'block';
}

export default function App() {
    const router = useRouter();
    const [isLoading, setisLoading] = useState(true);
    const [listsList, setlistsList] = useState([]);

    useEffect(() => {
        async function getLists(userId) {
            await axios.post('../.netlify/functions/retrieveUserLists', { userId: userId })
                .then(response => {
                    setlistsList(response.data);
                    setisLoading(false);
                    if (response.data.length === 0) {
                        document.getElementById('noListMessage').style.display = 'block'
                    }
                })
                .catch(error => {
                    console.error(error)
                })
        }

        async function validateUserToken() {
            await axios.get('../.netlify/functions/verifyToken', { withCredentials: true })
                .then((response) => {
                    // Valid token - redirect to dashboard or perform actions
                    console.log('Token Authenticated, hello ' + response.data.username);
                    console.log(response.data.code)

                    // Initiate a function call to retrieve the user's lists to display on dashboard
                    getLists(response.data.id)
                })
                .catch((error) => {
                    // Not a valid token - redirect to login page
                    if (error.response.status === 401) {
                        router.push('../sign-in')
                    }
                })
        }

        validateUserToken();
    }, []);

    return (
        <div className="content">
            {isLoading ? <LoadingContainer /> : <ListViewer listsList={listsList} onCardClick={handleCardClick}/>}
            <div className={styles.listPreviewContainer}>
                <div id="noListMessage" className="centered" style={{ textAlign: 'center', width: '100%', display: 'block' }}>
                    <p>Nothing to see here.</p>
                    <p>Select a list to view or create one <Link href="../list/new">here</Link>.</p>
                </div>
                <div id="listPreview" className={styles.listPreview} style={{ display: 'none' }}>
                    <h2 id="listTitle"></h2>
                    <p id="listDescription"></p>
                </div>
            </div>
        </div>
    )
}