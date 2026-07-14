'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SectionForm from '@/components/SectionForm'
import Button from '@/components/Button'
import Toast, { ToastType } from '@/components/Toast'

export default function NewSectionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  async function handleSubmit(data: { title: string; slug: string; body: string; order: number }) {
    setLoading(true)
    const res = await fetch('/api/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const section = await res.json()
    setLoading(false)
    if (res.ok) {
      setToast({ message: 'Apartado creado. Redirigiendo...', type: 'success' })
      setTimeout(() => router.push(`/sections/${section.id}`), 800)
    } else {
      setToast({ message: 'Error al crear apartado', type: 'error' })
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={() => router.push('/sections')}>
          ← Volver
        </Button>
        <h1 className="text-3xl font-bold">Nuevo apartado</h1>
      </div>

      <p className="text-gray-600 bg-blue-50 border border-blue-100 rounded p-4">
        Guarda el apartado. Luego podrás subir archivos (PDF, imágenes, Excel, etc.) y agregar enlaces en la siguiente pantalla.
      </p>

      <SectionForm onSubmit={handleSubmit} loading={loading} />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
