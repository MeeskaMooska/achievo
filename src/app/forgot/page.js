'use client'

import { useState } from 'react';
import styles from './page.module.css';
import { ForgotPasswordContainer, ForgotPasswordIdentifierEntry, ForgotPasswordCodeEntry } from './components'


export default function App() {
    return (
        <div className={styles.forgotBox}>
            <div className={styles.logoContainer}>
            <h1 className={styles.forgotTitle}>Achievo</h1>
                <div className={styles.checkmarkContainer}>
                    <div className={styles.checkmarkPositioner}>
                        <div className={styles.checkmark}></div>
                    </div>
                </div>
            </div>
            <ForgotPasswordContainer>
                <ForgotPasswordIdentifierEntry />
            </ForgotPasswordContainer>
        </div>
    )
}