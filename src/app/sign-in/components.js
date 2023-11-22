import styles from './components.module.css'
import { useState } from 'react'

function handleInputFocus(e) {
    const inputObject = e.target
    try {
        let inputLabel = inputObject.previousElementSibling
        inputLabel.classList.add(styles.active)
        inputLabel.style.color = 'black'
    } catch (TypeError) {
        let parent = inputObject.parentElement
        let inputLabel = parent.previousElementSibling
        inputLabel.classList.add(styles.active)
        inputLabel.style.color = 'black'
    }
}

function handleInputBlur(e) {
    const inputObject = e.target
    try {
        let inputLabel = inputObject.previousElementSibling
        if (inputObject.value === '') {
            inputLabel.classList.remove(styles.active)
        }
        inputLabel.style.color = 'grey'
    } catch (TypeError) {
        let parent = inputObject.parentElement
        let inputLabel = parent.previousElementSibling
        if (inputObject.value === '') {
            inputLabel.classList.remove(styles.active)
        }
        inputLabel.style.color = 'grey'
    }
}

const ProfileAccessContainer = ({ children, isSignIn, handleTabSelectorClick }) => {
    return (
        <div className={styles.profileAccessContainer}>
            <TabSelectorContainer handleTabSelectorClick={handleTabSelectorClick} />
            {children}
            {isSignIn ? <a href="../forgot">Forgot email or password?</a> : null}
        </div>
    )
}

const TabSelectorContainer = ({ handleTabSelectorClick }) => {
    return (
        <div className={styles.tabSelectorContainer}>
            <button className={`${styles.tabSelector} ${styles.active}`} id="tab-selector-0" onClick={handleTabSelectorClick}>Sign In</button>
            <button className={styles.tabSelector} id="tab-selector-1" onClick={handleTabSelectorClick}>Sign Up</button>
        </div>
    )
}

const SignInForm = ({ handleIdentifier, handlePassword, handleSubmit }) => {
    return (
        <form className={styles.profileAccessForm} style={{paddingBottom: '0px'}}>
            <UserIdentifierInput handleIdentifier={handleIdentifier} />
            <PasswordInput handlePassword={handlePassword} />
            <button onClick={(e) => handleSubmit (e)}>Sign In</button>
        </form>
    )
}

const SignUpForm = ({ handleUsername, handleEmail, handlePassword, handleSubmit }) => {
    return (
        <form className={styles.profileAccessForm}>
            <UserIdentifierInput handleIdentifier={handleUsername} placeholderLabel="Username" />
            <UserIdentifierInput handleIdentifier={handleEmail} placeholderLabel="Email" />
            <PasswordInput handlePassword={handlePassword} />
            <button onClick={(e) => handleSubmit (e)}>Sign Up</button>
        </form>
    )
}

const UserIdentifierInput = ({ handleIdentifier, placeholderLabel = "Username or Email" }) => {
    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            e.preventDefault()
        }

        if (e.key === 'Space') {
            e.preventDefault()
        }
    }

    return (
        <div className={styles.profileAccessInputContainer}>
            <label htmlFor="userIdentifier" className={styles.profileAccessInputLabel}>{placeholderLabel}</label>
            <textarea id="userIdentifier" className={styles.profileAccessInput} rows="1" onKeyDown={(e) => handleKeyPress(e)}
                onFocus={(e) => handleInputFocus(e)} onBlur={(e) => handleInputBlur(e)} onChange={(e) => handleIdentifier(e)}></textarea>
        </div>
    )
}

const PasswordInput = ({ handlePassword }) => {
    const [securePassword, setSecurePassword] = useState('text')

    function handlePasswordHideClick(e) {
        const passwordHideButton = e.target
        const passwordInput = document.getElementById('signInPassword')
        if (passwordHideButton.innerHTML == 'ABC') {
            passwordHideButton.innerHTML = '•'
            passwordHideButton.style.fontSize = '28px'
            setSecurePassword('password')
        } else {
            passwordHideButton.innerHTML = 'ABC'
            passwordHideButton.style.fontSize = '10px'
            passwordInput.style.color = 'black'
            setSecurePassword('text')
        }
    }

    return (
        <div className={styles.profileAccessInputContainer}>
            <label htmlFor="passwordId" className={styles.profileAccessInputLabel}>Password</label>
            <div className={styles.profileAccessPasswordContainer} >
                <input id="passwordId" type={securePassword}
                    className={`${styles.profileAccessInput} ${styles.passwordInput}`} 
                    onChange={(e) => handlePassword(e)}
                    onFocus={(e) => handleInputFocus(e)} 
                    onBlur={(e) => handleInputBlur(e)}></input>
                <div className={styles.passwordHideButton}
                    onClick={(e) => handlePasswordHideClick(e)}>
                    ABC
                </div>
            </div>
        </div>
    )
}

const LoadingContainer = () => {
    return (
        <div className={styles.loadingScreenContainer}>
            <h3>ACHIEVO</h3>
            <p>Signing you in now...</p>
            <div className={styles.loadingBarContainer}><div className={styles.loadingBar}></div></div>
        </div>
    )
}

// styles.
// className={}
// className={`${styles.} ${styles.}`}

export { ProfileAccessContainer, SignInForm, SignUpForm, LoadingContainer, TabSelectorContainer }