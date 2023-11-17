'use client'

import './globals.css'
import styles from './page.module.css'

export default function App() {
  const handleGetStarted = async () => {
    window.location.href = '/dashboard'
  };
  return (
    <div className="centered">
      <div className={styles.home_content}>
        <h1>Achievo</h1>
        <h2>Your Tasks, Our Priority: Simplify Your Day with Achievo.</h2>
        <a className="link-button" onClick={handleGetStarted}>Get started with Achievo.</a>
      </div>
    </div>
  )
}