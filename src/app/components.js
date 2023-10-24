import styles from './components.module.css'

const Button = ({text}) => {
    return (
        <button className={styles.button}>{text}</button>
    )
}

const Header = () => {
    return (
        <header className={styles.header}>
            <h1 className={styles.headerTitle}>Achievo</h1>
            <div className={styles.headerLinkContainer}>
              <a href='dashboard'>Dashboard</a>
              <a href='sign-in'>Sign In</a>
              <a href='sign-up'>Register</a>
            </div>
          </header>
    )
}

export {Button, Header};