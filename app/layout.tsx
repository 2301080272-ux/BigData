import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sitio Público',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="min-h-screen p-6">{children}</body>
    </html>
  )
}
