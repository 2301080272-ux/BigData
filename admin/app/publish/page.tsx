'use client'

import { useState } from 'react'
import Button from '@/components/Button'
import Toast, { ToastType } from '@/components/Toast'

export default function PublishPage() {
  const [publishing, setPublishing] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  async function handlePublish() {
    if (!confirm('¿Publicar los cambios en el sitio web?')) return
    setPublishing(true)
    const res = await fetch('/api/publish', { method: 'POST' })
    const json = await res.json()
    setPublishing(false)
    if (json.ok) {
      setToast({ message: 'Publicado correctamente', type: 'success' })
    } else {
      setToast({ message: 'Error: ' + json.error, type: 'error' })
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Publicar sitio</h1>
        <p className="text-gray-600">
          Sube los cambios de apartados y archivos al repositorio para que el sitio público se actualice.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <p className="text-sm text-gray-600">
          Al publicar se ejecuta:
        </p>
        <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
          <li>Se genera <code>content.json</code> con todos los apartados.</li>
          <li>Se copian los archivos a <code>public-site/public/uploads</code>.</li>
          <li>Se hace <code>git commit</code> y <code>git push</code> al repositorio.</li>
          <li>Vercel/Netlify reconstruye el sitio automáticamente.</li>
        </ol>
        <Button onClick={handlePublish} disabled={publishing} variant="success">
          {publishing ? 'Publicando...' : 'Publicar ahora'}
        </Button>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
