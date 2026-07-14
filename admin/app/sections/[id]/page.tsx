'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import SectionForm from '@/components/SectionForm'
import Button from '@/components/Button'
import Toast, { ToastType } from '@/components/Toast'

type FileItem = {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
}

type Link = {
  id: string
  title: string
  url: string
  order: number
}

type Section = {
  id: string
  title: string
  slug: string
  body: string
  order: number
  files: FileItem[]
  links: Link[]
}

export default function EditSectionPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [section, setSection] = useState<Section | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [linkSaving, setLinkSaving] = useState(false)
  const [linkForm, setLinkForm] = useState({ title: '', url: '', order: '0' })
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  async function fetchSection() {
    const res = await fetch('/api/sections')
    const data: Section[] = await res.json()
    const found = data.find((s) => s.id === id)
    if (found) setSection(found)
  }

  useEffect(() => {
    setLoading(true)
    fetchSection().finally(() => setLoading(false))
  }, [id])

  async function handleSubmit(data: { title: string; slug: string; body: string; order: number }) {
    setSaving(true)
    const res = await fetch(`/api/sections/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setSaving(false)
    if (res.ok) {
      setToast({ message: 'Apartado actualizado', type: 'success' })
    } else {
      setToast({ message: 'Error al actualizar', type: 'error' })
    }
  }

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const input = e.currentTarget.elements.namedItem('file') as HTMLInputElement
    if (!input.files?.length || !section) return
    const data = new FormData()
    data.append('file', input.files[0])
    data.append('sectionId', section.id)
    setUploading(true)
    const res = await fetch('/api/upload', { method: 'POST', body: data })
    setUploading(false)
    if (res.ok) {
      setToast({ message: 'Archivo subido', type: 'success' })
      fetchSection()
      input.value = ''
    } else {
      setToast({ message: 'Error al subir archivo', type: 'error' })
    }
  }

  async function deleteFile(fileId: string) {
    if (!confirm('¿Eliminar este archivo?')) return
    await fetch(`/api/files/${fileId}`, { method: 'DELETE' })
    setToast({ message: 'Archivo eliminado', type: 'success' })
    fetchSection()
  }

  async function handleAddLink(e: React.FormEvent) {
    e.preventDefault()
    if (!section) return
    setLinkSaving(true)
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...linkForm,
        order: Number(linkForm.order),
        sectionId: section.id,
      }),
    })
    setLinkSaving(false)
    if (res.ok) {
      setToast({ message: 'Enlace agregado', type: 'success' })
      setLinkForm({ title: '', url: '', order: '0' })
      fetchSection()
    } else {
      setToast({ message: 'Error al agregar enlace', type: 'error' })
    }
  }

  async function deleteLink(linkId: string) {
    if (!confirm('¿Eliminar este enlace?')) return
    await fetch(`/api/links/${linkId}`, { method: 'DELETE' })
    setToast({ message: 'Enlace eliminado', type: 'success' })
    fetchSection()
  }

  if (loading || !section) {
    return <p className="text-gray-600">Cargando...</p>
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={() => router.push('/sections')}>
          ← Volver
        </Button>
        <h1 className="text-3xl font-bold">Editar apartado</h1>
      </div>

      <SectionForm
        initial={section}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/sections')}
        loading={saving}
      />

      <section className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <h2 className="text-xl font-bold">Archivos</h2>
          <p className="text-sm text-gray-500">
            Sube cualquier tipo de archivo: PDF, imágenes, Excel, Power BI exportado, Word, etc.
          </p>
        </div>
        {section.files.length === 0 ? (
          <p className="text-gray-500">No hay archivos subidos.</p>
        ) : (
          <ul className="divide-y">
            {section.files.map((file) => (
              <li key={file.id} className="py-2 flex items-center justify-between">
                <div>
                  <p className="font-medium">{file.originalName}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={`/uploads/${file.filename}`}
                    download={file.originalName}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Descargar
                  </a>
                  <button
                    onClick={() => deleteFile(file.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={handleUpload} className="flex items-end gap-3 pt-2">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Subir archivo</label>
            <input
              name="file"
              type="file"
              accept="*/*"
              className="w-full border rounded p-2 text-sm"
              required
            />
          </div>
          <Button type="submit" disabled={uploading}>
            {uploading ? 'Subiendo...' : 'Subir'}
          </Button>
        </form>
      </section>

      <section className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <h2 className="text-xl font-bold">Enlaces</h2>
          <p className="text-sm text-gray-500">
            Agrega URLs: reportes de Power BI, dashboards, documentos en la nube, etc.
          </p>
        </div>
        {section.links.length === 0 ? (
          <p className="text-gray-500">No hay enlaces.</p>
        ) : (
          <ul className="divide-y">
            {section.links.map((link) => (
              <li key={link.id} className="py-2 flex items-center justify-between">
                <div>
                  <p className="font-medium">{link.title}</p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    {link.url}
                  </a>
                </div>
                <button
                  onClick={() => deleteLink(link.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={handleAddLink} className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
          <div className="md:col-span-4">
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              className="w-full border rounded p-2"
              value={linkForm.title}
              onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
              placeholder="Reporte Power BI"
              required
            />
          </div>
          <div className="md:col-span-6">
            <label className="block text-sm font-medium mb-1">URL</label>
            <input
              type="url"
              className="w-full border rounded p-2"
              value={linkForm.url}
              onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
              placeholder="https://..."
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Orden</label>
            <input
              type="number"
              className="w-full border rounded p-2"
              value={linkForm.order}
              onChange={(e) => setLinkForm({ ...linkForm, order: e.target.value })}
            />
          </div>
          <div className="md:col-span-12">
            <Button type="submit" disabled={linkSaving}>
              {linkSaving ? 'Agregando...' : '+ Agregar enlace'}
            </Button>
          </div>
        </form>
      </section>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
