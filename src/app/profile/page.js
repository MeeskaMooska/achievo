'use client'

import styles from './page.module.css';
import { ProfileSidebar, AccountDetailsBox } from './components.js';

export default function App() {
    return (
        <div className={styles.profileBox}>
            <AccountDetailsBox>
                <div className={styles.infoRowContainer}>
                    <div className={styles.infoKeyRow}>
                        <p className={styles.infoIdentifier}>Username:</p>
                        <p className={styles.infoIdentifier}>Email:</p>
                        <p className={styles.infoIdentifier}>Password:</p>
                    </div>
                    <div className={styles.infoValueRow}>
                        <p className={styles.info}>johndoe</p>
                        <div className={styles.changeableRow}>
                            <p className={styles.info}>johndoe@email.com</p>
                            <button className={styles.changeButton}>Change</button>
                        </div>
                        <div className={styles.changeableRow}>
                            <p className={styles.info}>••••••••</p>
                            <button className={styles.changeButton}>Change</button>
                        </div>
                    </div>
                </div>
                <div className={styles.applyDiscardContainer}>
                    <button>Apply</button>
                    <button>Discard</button>
                </div>
            </AccountDetailsBox>
        </div>
    )
}