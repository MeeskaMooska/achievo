import styles from './components.module.css'
import { useState } from 'react'
import Link from 'next/link'

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

const ProfileAccessContainer = ({ children, isSignIn }) => {
    return (
        <div className={styles.profileAccessContainer}>
            {children}
            {isSignIn ? <Link href="../forgot">Forgot password?</Link> : null}
        </div>
    )
}

const TabSelectorContainer = ({ handleTabSelectorClick, isSignIn = true }) => {
    return (
        isSignIn ? <div className={styles.tabSelectorContainer}>
            <button className={`${styles.tabSelector} ${styles.active}`} id="tab-selector-0" onClick={handleTabSelectorClick}>Sign In</button>
            <button className={styles.tabSelector} id="tab-selector-1" onClick={handleTabSelectorClick}>Sign Up</button>
        </div>
            :
            <div className={styles.tabSelectorContainer}>
                <button className={styles.tabSelector} id="tab-selector-0" onClick={handleTabSelectorClick}>Sign In</button>
                <button className={`${styles.tabSelector} ${styles.active}`} id="tab-selector-1" onClick={handleTabSelectorClick}>Sign Up</button>
            </div>
    )
}

const SignInForm = ({ handleIdentifier, handlePassword, handleSubmit }) => {
    // Username States
    const [usernameTooLong, setUsernameTooLong] = useState(false)
    const [usernameContainsSpecialChar, setUsernameContainsSpecialChar] = useState(false)

    // Password States
    const [passwordTooLong, setPasswordTooLong] = useState(false)
    const [passwordTooShort, setPasswordTooShort] = useState(false)
    const [passwordContainsSpaces, setPasswordContainsSpaces] = useState(false)
    const [passwordMissingUppercase, setPasswordMissingUppercase] = useState(false)
    const [passwordMissingNumber, setPasswordMissingNumber] = useState(false)
    const [passwordMissingSpecialCharacter, setPasswordMissingSpecialCharacter] = useState(false)

    function handlePasswordValidity(e) {
        const password = e.target.value

        setPasswordTooLong(password.length > 32)
        setPasswordTooShort(password.length < 8)
        setPasswordContainsSpaces(password.includes(' '))
        setPasswordMissingUppercase(!/[A-Z]/.test(password))
        setPasswordMissingNumber(!password.match(/\d/))
        setPasswordMissingSpecialCharacter(!/[!@#$%^&*\-_]/.test(password))

        if (password.length === 0) {
            setPasswordTooShort(false)
            setPasswordTooLong(false)
            setPasswordMissingSpecialCharacter(false)
            setPasswordContainsSpaces(false)
            setPasswordMissingUppercase(false)
            setPasswordMissingNumber(false)
        }
    }

    function handleUsernameValidity(e) {
        const username = e.target.value;
        const isValidUsername = /^[a-zA-Z0-9_]{1,16}$/;

        setUsernameTooLong(username.length > 16);
        setUsernameContainsSpecialChar(!isValidUsername);
    }

    return (
        <form className={styles.profileAccessForm} style={{ paddingBottom: '0px' }}>
            <UserIdentifierInput handleIdentifier={handleIdentifier} />
            <PasswordInput handlePassword={handlePassword} handlePasswordValidity={handlePasswordValidity} />
            {passwordTooLong ? <p className={styles.inputTip}>Password cannot be more than 32 characters long</p> : null}
            {passwordTooShort ? <p className={styles.inputTip}>Password must be 8 at least characters long</p> : null}
            {passwordContainsSpaces ? <p className={styles.inputTip}>Password cannot contain spaces</p> : null}
            {passwordMissingUppercase ? <p className={styles.inputTip}>Password must contain at least 1 uppercase letter</p> : null}
            {passwordMissingNumber ? <p className={styles.inputTip}>Password must contain at least 1 number</p> : null}
            {passwordMissingSpecialCharacter ? <p className={styles.inputTip}>Password must contain at least 1 special character
                <span className={styles.regexSpan}>!@#$%^&*\-_</span></p> : null}
            <button onClick={(e) => handleSubmit(e)}>Sign In</button>
        </form>
    )
}

const SignUpForm = ({ handleUsername, handleEmail, handlePassword, handleSubmit }) => {
    // Username States
    const [usernameTooLong, setUsernameTooLong] = useState(false)
    const [usernameContainsSpecialChar, setUsernameContainsSpecialChar] = useState(false)
    const [usernameContainsSpaces, setUsernameContainsSpaces] = useState(false)

    // Password States
    const [passwordTooLong, setPasswordTooLong] = useState(false)
    const [passwordTooShort, setPasswordTooShort] = useState(false)
    const [passwordContainsSpaces, setPasswordContainsSpaces] = useState(false)
    const [passwordMissingUppercase, setPasswordMissingUppercase] = useState(false)
    const [passwordMissingNumber, setPasswordMissingNumber] = useState(false)
    const [passwordMissingSpecialCharacter, setPasswordMissingSpecialCharacter] = useState(false)

    function handlePasswordValidity(e) {
        const password = e.target.value

        setPasswordTooLong(password.length > 32)
        setPasswordTooShort(password.length < 8)
        setPasswordContainsSpaces(password.includes(' '))
        setPasswordMissingUppercase(!/[A-Z]/.test(password))
        setPasswordMissingNumber(!password.match(/\d/))
        setPasswordMissingSpecialCharacter(!/[!@#$%^&*\-_]/.test(password))

        if (password.length === 0) {
            setPasswordTooShort(false)
            setPasswordTooLong(false)
            setPasswordMissingSpecialCharacter(false)
            setPasswordContainsSpaces(false)
            setPasswordMissingUppercase(false)
            setPasswordMissingNumber(false)
        }
    }

    function handleUsernameValidity(e) {
        const username = e.target.value;

        setUsernameContainsSpaces(username.includes(' '))
        setUsernameTooLong(username.length > 16);
        setUsernameContainsSpecialChar(/[!@#$%^&*\-_]/.test(username));
    }

    return (
        <form className={styles.profileAccessForm}>
            <UserIdentifierInput handleIdentifier={handleUsername} placeholderLabel="Username" inputId="username" handleUsernameValidity={handleUsernameValidity} />
            {usernameTooLong ? <p className={styles.inputTip}>Username cannot be more than 16 characters long</p> : null}
            {usernameContainsSpecialChar ? <p className={styles.inputTip}>Username cannot contain special characters<span className={styles.regexSpan}>!@#$%^&*\</span></p> : null}
            {usernameContainsSpaces ? <p className={styles.inputTip}>Username cannot contain spaces</p> : null}
            <UserIdentifierInput handleIdentifier={handleEmail} placeholderLabel="Email" inputId="email" />
            <PasswordInput handlePassword={handlePassword} handlePasswordValidity={handlePasswordValidity} />
            {passwordTooLong ? <p className={styles.inputTip}>Password cannot be more than 32 characters long</p> : null}
            {passwordTooShort ? <p className={styles.inputTip}>Password must be 8 at least characters long</p> : null}
            {passwordContainsSpaces ? <p className={styles.inputTip}>Password cannot contain spaces</p> : null}
            {passwordMissingUppercase ? <p className={styles.inputTip}>Password must contain at least 1 uppercase letter</p> : null}
            {passwordMissingNumber ? <p className={styles.inputTip}>Password must contain at least 1 number</p> : null}
            {passwordMissingSpecialCharacter ? <p className={styles.inputTip}>Password must contain at least 1 special character
                <span className={styles.regexSpan}>!@#$%^&*\-_</span></p> : null}
            <button onClick={(e) => handleSubmit(e)}>Sign Up</button>
        </form>
    )
}

const UserIdentifierInput = ({ handleIdentifier, placeholderLabel = "Username or Email", inputId = "userIdentifier", handleUsernameValidity = console.log }) => {
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
            <label htmlFor={inputId} className={styles.profileAccessInputLabel}>{placeholderLabel}</label>
            <textarea id={inputId} className={styles.profileAccessInput} rows="1" onKeyDown={(e) => handleKeyPress(e)}
                onFocus={(e) => handleInputFocus(e)} onBlur={(e) => handleInputBlur(e)}
                onChange={(e) => {
                    handleIdentifier(e)
                    handleUsernameValidity(e)
                }}></textarea>
        </div>
    )
}

const PasswordInput = ({ handlePassword, handlePasswordValidity }) => {
    const [securePassword, setSecurePassword] = useState('text')

    function handlePasswordHideClick(e) {
        const passwordHideButton = e.target
        if (passwordHideButton.innerHTML == 'ABC') {
            passwordHideButton.innerHTML = '•'
            passwordHideButton.style.fontSize = '28px'
            setSecurePassword('password')
        } else {
            passwordHideButton.innerHTML = 'ABC'
            passwordHideButton.style.fontSize = '10px'
            setSecurePassword('text')
        }
    }

    return (
        <div className={styles.profileAccessInputContainer}>
            <label htmlFor="passwordId" className={styles.profileAccessInputLabel}>Password</label>
            <div className={styles.profileAccessPasswordContainer} >
                <input id="passwordId" type={securePassword}
                    className={`${styles.profileAccessInput} ${styles.passwordInput}`}
                    onChange={(e) => {
                        handlePassword(e)
                        handlePasswordValidity(e)
                    }}
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

const LoadingContainer = ({ isSignIn }) => {
    return (
        <div className={styles.loadingScreenContainer}>
            <h3>ACHIEVO</h3>
            {isSignIn ? <p>Signing you in now...</p> : <p>Signing you up now...</p>}
            <div className={styles.loadingBarContainer}><div className={styles.loadingBar}></div></div>
        </div>
    )
}

// styles.
// className={}
// className={`${styles.} ${styles.}`}

export { ProfileAccessContainer, SignInForm, SignUpForm, LoadingContainer, TabSelectorContainer }