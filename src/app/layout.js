import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Achievo',
  description: 'Your Tasks, Our Priority: Simplify Your Day with Achievo.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
          <h1 className="header-title">To Do</h1>
          <div className="header-right">
            <a className="index.php">My dashboard</a>
            <a className="login.php">Login</a>
            <a className="register.php">Register</a>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
