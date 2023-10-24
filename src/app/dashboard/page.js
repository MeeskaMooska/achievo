'use client'

import React, { useEffect } from 'react';
import axios from 'axios';
import styles from './page.module.css'
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'


let details = null

const listsList = [
    { title: 'Test1', desc: 'Description1', list_id: '1' },
    { title: 'Test2', desc: 'Description2', list_id: '2' },
    { title: 'Test3', desc: 'Description3', list_id: '3' },
]

function handleCardClick(card) {
    details = JSON.parse(card.target.getAttribute('data-details'));

    document.getElementById('listTitle').innerHTML = details.title;
    document.getElementById('listDescription').innerHTML = details.desc;

    document.getElementById('noListMessage').style.display = 'none';
    document.getElementById('listPreview').style.display = 'block';
}

const ListCard = ({ title, desc, list_id }) => {
    let details = {
        title: title,
        desc: desc,
        list_id: list_id
    }

    return (
        <div className={styles.listCard} data-details={JSON.stringify(details)} onClick={handleCardClick}>
            <div className={styles.listPreview} data-details={JSON.stringify(details)}>
                placeholder
            </div>
            <h3 data-details={JSON.stringify(details)}>{title}</h3>
            <p data-details={JSON.stringify(details)}>{desc}</p>
        </div>
    )
}

export default function App() {
    useEffect(() => {
        function getLists() {
            axios.get('/api/lists')
                .then(res => {
                    console.log(res.data)
                    if (res.data.length === 0) {
                        document.getElementById('noListMessage').style.display = 'block'
                    }
                })
                .catch(err => {
                    console.error(err)
                })
        }

        function validateUserToken() {
            axios.get('../.netlify/functions/verifyToken', { withCredentials: true })
                .then((response) => {
                    // Valid token - redirect to dashboard or perform actions
                    console.log('Token Authenticated, hello ' + response.data.username);

                    // Initiate a function call to retrieve the user's lists to display on dashboard

                })
                .catch((error) => {
                    // Not a valid token - handle the error
                    console.error('Error from server:', error.response.data.error);
                });
        }
    }, []);


    return (
        <div className="content">
            <div className={styles.listsViewer}>
                <div className={styles.listCard} style={{height: 'calc(100% - 14px)', position: 'relative'}}>
                    <div className="centered" style={{textAlign: 'center'}}>
                    <FontAwesomeIcon icon={faPlus} />
                    <h3 style={{margin: '0'}}>New List</h3>
                    </div>
                </div>
                {listsList.map((list) => (
                    <ListCard
                        key={list.list_id} // Make sure to include a unique key for each component
                        title={list.title}
                        desc={list.desc}
                        list_id={list.list_id}
                    />
                ))}
            </div>
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