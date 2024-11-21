'use client'

import styles from './components.module.css'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

const Header = () => {
    const router = useRouter()
    const [navOpen, setNavOpen] = useState(false);
    const headerRef = useRef(null);

    useEffect(() => {
        if (headerRef.current) {
            if (navOpen) {
                headerRef.current.classList.add(styles.navOpen);
                document.body.style.overflow = "hidden";
            } else {
                headerRef.current.classList.remove(styles.navOpen);
                document.body.style.overflow = "";
            }
        }
    }, [navOpen]);

    return (
        <div>
            <header className={styles.header} ref={headerRef}>
                <Link href="/" className={styles.headerLogo}>Achievo</Link>
                <nav className={styles.headerNav}>
                    <Link href="../dashboard" className={styles.navLink}>Dashboard</Link>
                    <Link href="../list/new" className={styles.navLink}>Pricing</Link>
                    <Link href="../list/new" className={styles.navLink}>Features</Link>
                    <Link href="../profile" className={styles.navLink}>Community</Link>
                    <Link href="../profile" className={styles.navLink}>Support</Link>
                </nav>
                <div className={styles.profileButtonContainer}>
                    <Link href="../sign-in" className={styles.navLink}>Sign In</Link>
                    <Link href="../sign-up" className={`${styles.navLink} ${styles.fullBlueButton}`}>Sign Up</Link>
                </div>
                <button onClick={() => setNavOpen(!navOpen)} className={styles.mobileMenuButton}>Menu</button>
            </header>
            {navOpen && (
                <nav className={styles.headerNavMobile}>
                    <Link href="../dashboard" className={styles.mobileNavLink}>Dashboard</Link>
                    <Link href="../list/new" className={styles.mobileNavLink}>Pricing</Link>
                    <Link href="../list/new" className={styles.mobileNavLink}>Features</Link>
                    <Link href="../profile" className={styles.mobileNavLink}>Community</Link>
                    <Link href="../profile" className={styles.mobileNavLink}>Support</Link>
                    <Link href="../sign-in" className={styles.mobileNavLink}>Sign In</Link>
                    <Link href="../sign-up" className={styles.mobileNavLink}>Sign Up</Link>
                </nav>
            )}
        </div>
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

const AnimatedBlocks = () => {
    const [mounted, setMounted] = useState(false)
    const [blockSize, setBlockSize] = useState([null, null]);

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const updateBlockSize = () => {
            if (window.innerWidth <= 550) {
                setBlockSize([3, 6]);
            } else if (window.innerWidth <= 1000) {
                setBlockSize([7, 8]);
            } else {
                setBlockSize([10, 8]);
            }
        };

        updateBlockSize(); // Set on initial render
        window.addEventListener("resize", updateBlockSize);

        return () => window.removeEventListener("resize", updateBlockSize);
    }, []);

    const blockVariants = {
        initial: (i) => ({
            y: '-100vh',
            x: `${Math.random() * 100}vw`,
        }),
        fall: (i) => ({
            y: '100vh',
            transition: {
                type: 'spring',
                stiffness: 50,
                damping: 20,
                delay: i * 0.1,
            },
        }),
        align: (i) => ({
            y: `calc(50vh - 1.5rem)`,
            x: `calc(50vw - ${(blocks.length / 2 - i) * blockSize[0]}em)`,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 20,
                delay: .5 + i * 0.1,
            },
        }),
    }

    const blocks = Array.from({ length: blockSize[1] }, (_, i) => i)

    return (
        <div className={styles.blockContainer}>
            {mounted && blocks.map((_, i) => (
                <motion.div
                    key={i}
                    className={styles.block}
                    variants={blockVariants}
                    custom={i}
                    initial="initial"
                    animate={["fall", "align"]}
                />
            ))}
        </div>
    )
}

export { Header, Footer, AnimatedBlocks };