'use client'

import styles from './components.module.css'
import { useRouter } from 'next/navigation'

const Button = ({ text }) => {
    return (
        <button className={styles.button}>{text}</button>
    )
}

const Header = () => {
    const router = useRouter()

    return (
        <header className={styles.header}>
            <div className={styles.headerLeftBlock}>
                <a href="../" className={styles.headerTitle}>Achievo</a>
                <div className={styles.headerLinkContainer}>
                    <a href="../sign-in" className={styles.headerLink}>Sign In</a>
                    <a href="../dashboard" className={styles.headerLink}>Dashboard</a>
                    <a href="../list/new" className={styles.headerLink}>+List</a>
                </div>
            </div>
            <div className={styles.userContainer} onClick={() => router.push('../profile')}>
                <div className={styles.innerUserContainer}>
                    <div className={styles.userHeadContainer}>
                        <div className={styles.userHead}></div>
                    </div>
                    <div className={styles.userBody}></div>
                </div>
            </div>
        </header>
    )
}

export { Button, Header };