'use client'

import styles from './components.module.css'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
                <Link href="../" className={styles.headerTitle}>Achievo</Link>
                <div className={styles.headerLinkContainer}>
                    <Link href="../sign-in" className={styles.headerLink}>Sign In</Link>
                    <Link href="../dashboard" className={styles.headerLink}>Dashboard</Link>
                    <Link href="../list/new" className={styles.headerLink}>+List</Link>
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