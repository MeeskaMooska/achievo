'use client'

import './globals.css'
import styles from './page.module.css'

export default function App() {
    const handleGetStarted = async () => {
        window.location.href = '/dashboard'
    };

    return (
        <div className={styles.homeHeroContainer}>
            <div className={styles.homeHeroOverlay}></div>
            <div className={styles.homeContentContainer}>
                <h1>Achievo</h1>
                <p>Ever get lost in large projects?</p>
                <h2>Your Tasks, Our Priority: Simplify Your Day with Achievo.</h2>
                <button onClick={handleGetStarted} className={styles.getStartedButton}>Get Started</button>
            </div>
        </div>
    )
}