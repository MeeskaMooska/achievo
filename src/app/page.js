'use client'

import './globals.css'
import styles from './page.module.css'
import { AnimatedBlocks } from './components'

export default function App() {
    const handleGetStarted = async () => {
        window.location.href = '/dashboard'
    };

    return (
        <div className={styles.homeHeroContainer}>
            <AnimatedBlocks />
            <div className={styles.homeHeroOverlay}></div>
            <div className={styles.homeContentContainer}>
                <h1>Achievo</h1>
                <h2>With Achievo, everything falls into place.</h2>
                <div className={styles.heroNav}>
                    <button onClick={handleGetStarted} className={`${styles.tryItButtonHero} ${styles.heroButton}`}>Try It</button>
                    <button onClick={handleGetStarted} className={`${styles.logInButtonHero} ${styles.heroButton}`}>Log In</button>
                </div>
            </div>
        </div>
    )
}