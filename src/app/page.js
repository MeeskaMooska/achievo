'use client'

import './globals.css'
import styles from './page.module.css'
import Cookies from 'js-cookie'

export default function App() {
  const handleGetStarted = () => {
    const user_session_token = Cookies.get('user_session_token');
    console.log('User session token: ', user_session_token);
    /*
    if (user_session_token) {
      // window.location.href = "./dashboard";
      console.log('User session token exists.');
    } else {
      console.log('User session token does not exist----------------------.');
      window.location.href = "./sign-up";
    } */
  };
  return (
    <div className="centered">
        <div className={styles.home_content}>
            <h1>To Do</h1>
            <h2>Your Tasks, Our Priority: Simplify Your Day with To Do.</h2>
            <p style={{marginBottom: 45}}>An application by <a href="https://tayven-stover.com">Tayven Stover</a>.</p>
            <a className="link-button" onClick={handleGetStarted}>Get started with To Do.</a>
        </div>
    </div>
  )
}