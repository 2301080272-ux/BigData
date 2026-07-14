'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/sections', label: 'Apartados' },
  { href: '/files', label: 'Archivos' },
  { href: '/publish', label: 'Publicar' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white border p-2 rounded shadow"
      >
        {open ? 'Cerrar' : 'Menú'}
      </button>
      <aside
        className={[
          'fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white p-6 transform transition-transform',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <h1 className="text-xl font-bold mb-8">Admin</h1>
        <nav className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={[
                'block px-4 py-2 rounded transition-colors',
                pathname === link.href
                  ? 'bg-blue-600 font-medium'
                  : 'hover:bg-slate-800',
              ].join(' ')}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}
