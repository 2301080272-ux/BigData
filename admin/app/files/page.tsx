'use client'

import { useEffect, useState } from 'react'
import FileList from '@/components/FileList'
import Toast, { ToastType } from '@/components/Toast'

type FileItem = {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  sectionId: string
}

type Section = {
  id: string
  title: string
  slug: string
  body: string
  order: number
  files: FileItem[]
}

type FileWithSection = FileItem & { section?: { title: string } }

export default function FilesPage() {
  const [files, setFiles] = useState<FileWithSection[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  async function fetchFiles() {
    setLoading(true)
    const res = await fetch('/api/sections')
    const sections: Section[] = await res.json()
    const allFiles: FileWithSection[] = sections.flatMap((s) =>
      s.files.map((f) => ({ ...f, section: { title: s.title } }))
    )
    setFiles(allFiles)
    setLoading(false)
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este archivo?')) return
    await fetch(`/api/files/${id}`, { method: 'DELETE' })
    setToast({ message: 'Archivo eliminado', type: 'success' })
    fetchFiles()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Archivos</h1>
        <p className="text-gray-600">Todos los archivos subidos por apartado.</p>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando...</p>
      ) : (
        <FileList files={files} onDelete={handleDelete} />
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
