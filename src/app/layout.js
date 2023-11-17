import './globals.css'
import { Inter } from 'next/font/google'
import { Header } from './components'
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Achievo',
  description: 'Your Tasks, Our Priority: Simplify Your Day with Achievo.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="container">
          <Header />
          {children}
        </div>
        <footer>Achievo</footer>
      </body>
    </html>
  )
}
