import './globals.css'
import type { Metadata } from 'next'
import Header from '../components/Header'

export const metadata: Metadata = {
  title: 'CineMagic - Discover Movies & TV Shows',
  description: 'Search and discover your favorite movies and TV shows',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-cinema-dark text-cinema-text">
        <Header />
        {children}
      </body>
    </html>
  )
}