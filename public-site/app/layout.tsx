import type { Metadata } from 'next'
import './globals.css'
import Avatar from './components/Avatar'
import { ThemeProvider } from './components/ThemeProvider'
import ThemeToggle from './components/ThemeToggle'

export const metadata: Metadata = {
  title: 'Portafolio Big Data - Reyna Saravia Andrea',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen antialiased bg-purple-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
          {/* Portfolio Header */}
          <header
            className="relative hidden text-white shadow-lg bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/uploads/bigdata-bg.jpg)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-indigo-900/85 to-blue-900/90" />
            <div className="relative max-w-7xl mx-auto px-6 py-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Student photo */}
                <div className="flex-shrink-0">
                  <Avatar
                    src="/uploads/student-photo.jpg"
                    alt="Reyna Saravia Andrea"
                    fallback="RA"
                    className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white/40 shadow-lg"
                  />
                </div>

                {/* Student info */}
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold">Reyna Saravia Andrea</h1>
                  <p className="text-purple-100 text-lg md:text-xl mt-1">Portafolio del curso de Big Data</p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">Ciclo: VII</span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">Turno: TB2</span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">Año 2026</span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3 mt-2 md:mt-0">
                  {/* Teacher */}
                  <div className="flex flex-col items-center gap-2">
                    <Avatar
                      src="/uploads/teacher-photo.jpg"
                      alt="Claudio Isaias Huancahuire Bravo"
                      fallback="CH"
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-white/40 shadow-md"
                    />
                    <span className="text-xs md:text-sm text-purple-100 text-center max-w-[180px]">
                      Docente: Claudio Isaias Huancahuire Bravo
                    </span>
                  </div>

                  {/* Theme toggle */}
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 flex">
            {children}
          </div>
        </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
