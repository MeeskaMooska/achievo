import './globals.css'
import { Header, Footer } from './components'
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;


export const metadata = {
  title: 'Achievo',
  description: 'Your Tasks, Our Priority: Simplify Your Day with Achievo.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <Header />
      {children}
        
        <Footer />
      </body>
    </html>
  )
}

/**
 * <div className="container">
          
        </div>
 */
