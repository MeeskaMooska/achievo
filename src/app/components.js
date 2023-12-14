'use client'

import styles from './components.module.css'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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

const Footer = () => {
    function onFormSubmit(e) {
        e.preventDefault()
    }

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

    return (
        <footer className={styles.footer}>
            <div className={styles.footerBusinessSection}>
                <h1 className={styles.footerTitle}>Achievo</h1>
                <h3 className={styles.footerSlogan}>Your Tasks, Our Priority</h3>
                <p className={styles.footerCredit}>A webapp by <Link href="https://tayven-stover.com" target="_blank">Tayven Stover</Link></p>
            </div>
            <div className={styles.footerDivider}></div>
            <div className={styles.footerLinkSection}>
                <div className={styles.footerLinkContainer}>
                    <p className={styles.linkSectionTitle}>Site Links</p>
                    <Link href="../dashboard" className={styles.linkSectionLink}>Dashboard</Link>
                    <Link href="../list/new" className={styles.linkSectionLink}>+List</Link>
                    <Link href="../sign-in" className={styles.linkSectionLink}>Sign in</Link>
                    <Link href="../sign-up" className={styles.linkSectionLink}>Sign up</Link>
                    <Link href="../profile" className={styles.linkSectionLink}>My profile</Link>
                </div>
                <div className={styles.footerLinkContainer}>
                    <p className={styles.linkSectionTitle}>My Sites</p>
                    <Link href="" className={styles.linkSectionLink} target="_blank">Portfolio</Link>
                    <Link href="" className={styles.linkSectionLink} target="_blank">SCR</Link>
                    <Link href="" className={styles.linkSectionLink} target="_blank">Today Chat</Link>
                    <Link href="" className={styles.linkSectionLink} target="_blank">Github</Link>
                </div>
            </div>
            <div className={styles.footerDivider}></div>
            <div className={styles.footerContactSection}>
                <h2 className={styles.contactTitle}>Contact us.</h2>
                <form className={styles.footerContactForm}>
                    <div className={styles.footerInputContainer}>
                        <label htmlFor="footerName" className={styles.footerInputLabel}>Name:</label>
                        <input className={styles.footerInput} type="text" id="footerName"
                        onFocus={(e) => handleInputFocus(e)} onBlur={(e) => handleInputBlur(e)}></input>
                    </div>
                    <div className={styles.footerInputContainer}>
                        <label htmlFor="footerEmail" className={styles.footerInputLabel}>Email:</label>
                        <input className={styles.footerInput} type="email" id="footerEmail"
                        onFocus={(e) => handleInputFocus(e)} onBlur={(e) => handleInputBlur(e)}
                        ></input>
                    </div>
                    <div className={styles.footerInputContainer}>
                        <label htmlFor="footerName" className={styles.footerMessageLabel}>Message:</label>
                        <textarea id="footerMessage" className={styles.footerMessage} cols={2}
                        onFocus={(e) => handleInputFocus(e)} onBlur={(e) => handleInputBlur(e)}></textarea>
                    </div>
                    <input type="submit" value="Send" className={styles.footerSubmit}></input>
                </form>
            </div>
        </footer>
    )
}

export { Header, Footer };