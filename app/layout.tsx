import './globals.css'
import type { Metadata } from 'next'
import { Bodoni_Moda, Work_Sans, JetBrains_Mono } from 'next/font/google'
import type { ReactNode } from 'react'
import ClientLayout from '../components/ClientLayout'

const bodoniModa = Bodoni_Moda({
  variable: '--font-display',
  subsets: ['latin'],
  style: ['normal', 'italic'],
})

const workSans = Work_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'CineMagic 🎬 - Discover Movies & TV Shows',
  description: 'A curated film archive experience. Discover movies and TV shows with cinematic elegance.',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${bodoniModa.variable} ${workSans.variable} ${jetbrainsMono.variable} font-sans bg-cinema-dark text-cinema-text antialiased`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
