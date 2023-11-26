'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation'
import styles from './page.module.css';
import componentStyles from './components.module.css';
import { ForgotPasswordContainer, ForgotPasswordIdentifierEntry, ForgotPasswordCodeEntry, ForgotPasswordNewPasswordEntry } from './components'
import Link from 'next/link'
import axios from 'axios'

export default function App() {
    const router = useRouter()
    const [isEmailEntry, setIsEmailEntry] = useState(true)
    const [isCodeEntry, setIsCodeEntry] = useState(true)
    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState({})

    const EmailSubmitButtonPressed = async (e) => {
        e.preventDefault()
        await axios.post('/.netlify/functions/sendEmailCode', { email: email })
            .then((response) => {
                setIsEmailEntry(false)
                setUser(response.data.user)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const CodeSubmitButtonPressed = async (e) => {
        e.preventDefault()
        await axios.post('/.netlify/functions/verifyResetCode', { userId: user.id, code: code })
            .then((response) => {
                console.log(response)
                setIsCodeEntry(false)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const passwordSubmitButtonPressed = async (e) => {
        e.preventDefault()
        await axios.post('/.netlify/functions/changePassword', { user: user, password: password, code: code })
            .then((response) => {
                router.push('../dashboard')
                console.log(response)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const EmailChange = (e) => {
        setEmail(e.target.value)
    }

    const codeChange = (e) => {
        setCode(e.target.value)
    }

    const passwordChange = (e) => {
        setPassword(e.target.value)
    }

    return (
        <div className={styles.forgotBox}>
            <div className={styles.logoContainer}>
                <h1 className={styles.forgotTitle}>Achievo</h1>
                <div className={styles.checkmarkContainer}>
                    <div className={styles.checkmarkPositioner}>
                        <div className={styles.checkmark}></div>
                    </div>
                </div>
            </div>
            <ForgotPasswordContainer>
                {isEmailEntry ?
                    <ForgotPasswordIdentifierEntry onSubmit={(e) => EmailSubmitButtonPressed(e)}
                        emailChange={(e) => EmailChange(e)} />
                    :
                    isCodeEntry ?
                        <ForgotPasswordCodeEntry onSubmit={(e) => CodeSubmitButtonPressed(e)}
                            codeChange={(e) => codeChange(e)} />
                        :
                        <ForgotPasswordNewPasswordEntry onSubmit={(e) => passwordSubmitButtonPressed(e)}
                            passwordChange={(e) => passwordChange(e)} />}
                {isEmailEntry ?
                    <Link href="../sign-in" className={componentStyles.signInLink}>Back to sign in.</Link>
                    :
                    null}
            </ForgotPasswordContainer>
        </div>
    )
}
