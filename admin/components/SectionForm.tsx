'use client'

import { useState } from 'react'
import Button from './Button'

type Section = {
  id: string
  title: string
  slug: string
  body: string
  order: number
}

type Props = {
  initial?: Partial<Section>
  onSubmit: (data: { title: string; slug: string; body: string; order: number }) => void
  onCancel?: () => void
  loading?: boolean
}

export default function SectionForm({ initial, onSubmit, onCancel, loading }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [slug, setSlug] = useState(initial?.slug ?? '')
  const [body, setBody] = useState(initial?.body ?? '')
  const [order, setOrder] = useState(String(initial?.order ?? 0))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({ title, slug, body, order: Number(order) })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <input
            className="w-full border rounded p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug (URL)</label>
          <input
            className="w-full border rounded p-2"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            placeholder="ejemplo-apartado"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Orden</label>
        <input
          type="number"
          className="w-full md:w-32 border rounded p-2"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Contenido</label>
        <textarea
          rows={6}
          className="w-full border rounded p-2"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Escribe el contenido del apartado..."
        />
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}
