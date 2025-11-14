import './globals.css'
import type { Metadata } from 'next'
import ClientLayout from '../components/ClientLayout'

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
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}