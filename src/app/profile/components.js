import styles from './components.module.css';

const ProfileSidebar = () => {
    return (
        <div className={styles.profileSidebar}>
            <button className={styles.profileSidebarButton}>Settings &#9881;</button>
        </div>
    )
}

const AccountDetailsBox = ({ children }) => {
    return (
        <div className={styles.accountDetailsBox}>
            <div className={styles.accountDetailsInnerBox}>
                <h1 className={styles.accountDetailsTitle}>Account Details</h1>
                <div className={styles.accountDetailsContainer}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export { ProfileSidebar, AccountDetailsBox }