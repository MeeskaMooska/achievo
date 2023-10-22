'use client'

import React, { useEffect } from 'react';
import axios from 'axios';

export default function App() {
    let username = "tayven"

    useEffect(() => {
        console.log('test')
            axios.get('../.netlify/functions/verifyToken', { withCredentials: true })
                .then((response) => {
                    // Valid token - redirect to dashboard or perform actions
                    console.log('Response from server:', response);
                })
                .catch((error) => {
                    // Not a valid token - handle the error
                    console.error('Error from server:', error.response.data);
                });

        // Call the function when the component loads
    }, []);

    return (
        <div className="centered">
            hello {username}
        </div>
    )
}