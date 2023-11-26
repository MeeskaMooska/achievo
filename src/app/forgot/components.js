import styles from './components.module.css'
import {useState, useEffect} from 'react'

const ForgotPasswordContainer = ({ children }) => {
    return (
        <div className={styles.forgotPasswordContainer}>
            {children}
        </div>
    )
}

const ForgotPasswordIdentifierEntry = ({ onSubmit, emailChange }) => {
    return (
        <form className={styles.forgotEntry}>
            <h3 className={styles.entryTitle}>Forgot your password?</h3>
            <p className={styles.entryText}>Please enter your preferred email address or username associated with that
                email for a code to be sent for password reset.</p>
            <label className={styles.entryLabel} htmlFor="userIdentifier">Enter username or email</label>
            <input className={styles.entryInput} placeholder="Email or Username"
                type="text" id="userIdentifier" onChange={emailChange}></input>
            <button className={styles.entryButton} type="submit" onClick={onSubmit}>Send code</button>
        </form>
    )
}

const ForgotPasswordCodeEntry = ({ onSubmit, codeChange, onResendPress }) => {
    const [seconds, setSeconds] = useState(60);
    const [resendAvailable, setResendAvailable] = useState(false);

    useEffect(() => {
        let interval = null;

        if (seconds > 0) {
            interval = setInterval(() => {
                setSeconds(seconds => seconds - 1);
            }, 1000);
        } else if (seconds === 0) {
            setResendAvailable(true);
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [seconds]);

    return (
        <form className={styles.forgotEntry}>
            <h3 className={styles.entryTitle}>Code sent!</h3>
            <p className={styles.entryText}>A code has been sent to the email you entered, containing a six
                digit code for temporary access to your account to reset the password. You may need to check your spam.
                Please hurry, your code will expire in 10 minutes.</p>
            <label className={styles.entryLabel} htmlFor="code">Please enter the code below:</label>
            <input className={styles.entryInput} placeholder="Six digit code." type="number" id="code"
                onChange={codeChange}></input>
            {resendAvailable ? <button id="resendButton" className={styles.entryButton} type="submit" onClick={onResendPress} style={{marginBottom: '18px'}}>Resend code</button>
            :
            <p className={styles.resendText}>Didn't receive a code? please wait: <br/>{seconds} more seconds before re-sending.</p>}
            <button className={styles.entryButton} type="submit" onClick={onSubmit}>Submit code</button>
        </form>
    )
}

const ForgotPasswordNewPasswordEntry = ({ onSubmit, passwordChange }) => {
    return (
        <form className={styles.forgotEntry}>
            <h3 className={styles.entryTitle}>Verification success!</h3>
            <p className={styles.entryText}>Please enter your new password (this will be your 
            password until you may decide to change it in the future)</p>
            <label className={styles.entryLabel} htmlFor="password">Enter your new password:</label>
            <input className={styles.entryInput} placeholder="New Password"
                type="text" id="password" onChange={passwordChange}></input>
            <button className={styles.entryButton} type="submit" onClick={onSubmit}>Submit</button>
        </form>
    )
}

export { ForgotPasswordContainer, ForgotPasswordIdentifierEntry, ForgotPasswordCodeEntry, ForgotPasswordNewPasswordEntry }