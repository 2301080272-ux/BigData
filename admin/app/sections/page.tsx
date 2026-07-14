'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SectionCard from '@/components/SectionCard'
import Button from '@/components/Button'
import Toast, { ToastType } from '@/components/Toast'

type Section = {
  id: string
  title: string
  slug: string
  body: string
  order: number
  files: { id: string }[]
  links: { id: string }[]
}

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  async function fetchSections() {
    setLoading(true)
    const res = await fetch('/api/sections')
    const data = await res.json()
    setSections(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchSections()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este apartado?')) return
    await fetch(`/api/sections/${id}`, { method: 'DELETE' })
    setToast({ message: 'Apartado eliminado', type: 'success' })
    fetchSections()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Apartados</h1>
          <p className="text-gray-600">Gestiona los apartados del sitio público.</p>
        </div>
        <Link href="/sections/new">
          <Button>+ Nuevo apartado</Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando...</p>
      ) : sections.length === 0 ? (
        <p className="text-gray-600">No hay apartados. Crea el primero.</p>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <SectionCard key={section.id} section={section} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
