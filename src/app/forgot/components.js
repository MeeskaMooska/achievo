import styles from './components.module.css';
import Link from 'next/link'

const ForgotPasswordContainer = ({ children }) => {
    return (
        <div className={styles.forgotPasswordContainer}>
            {children}
            <Link href="../sign-in" className={styles.signInLink}>Back to sign in.</Link>
        </div>
    )
}

const ForgotPasswordIdentifierEntry = () => {
    return (
        <form className={styles.forgotEntry}>
            <h3 className={styles.entryTitle}>Forgot your password?</h3>
            <p className={styles.entryText}>Please enter your preferred email address or username associated with that email for a code to be sent for password reset.</p>
            <label className={styles.entryLabel} htmlFor="userIdentifier">Enter username or email</label>
            <input className={styles.entryInput} placeholder="Email or Username" type="text" id="userIdentifier"></input>
            <button className={styles.entryButton} type="submit">Send code</button>
        </form>
    )
}

const ForgotPasswordCodeEntry = () => {

}

export { ForgotPasswordContainer, ForgotPasswordIdentifierEntry, ForgotPasswordCodeEntry }