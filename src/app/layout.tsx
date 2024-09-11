'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '../components/ThemeProvider'
import { DeepgramProvider } from '@/lib/contexts/DeepgramContext'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <DeepgramProvider>
            {children}
          </DeepgramProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
