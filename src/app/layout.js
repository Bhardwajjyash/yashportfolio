import { Orbitron, JetBrains_Mono, Inter } from 'next/font/google'
import SmoothScroll from '@/components/SmoothScroll'
import './globals.css'

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['400', '500', '700', '900'],
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata = {
  title: 'YASH BHARDWAJ ',
  description: 'Advanced Holographic System Interface.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${jetbrains.variable} ${inter.variable}`}>
      <body className="bg-void text-white overflow-x-hidden antialiased">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}