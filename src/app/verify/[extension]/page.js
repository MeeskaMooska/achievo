'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './page.module.css';

export default function App({ params }) {
    const extension = params.extension; 

    useEffect(() => {
        async function verifyEmail() {
            try {
                const response = await fetch ('../.netlify/functions/emailAuthValidator', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(extension)
                });
                const data = await response.json();
        
                console.log(data.message || data.error);
            } catch (error) {
                console.log(error);
            }
        }

        verifyEmail();
    }, []);
    return (
        <div className="centered">
            <h1>Verifying email...</h1>
        </div>
    )
}