'use client'

import { FormEvent } from 'react'

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
  files: FileItem[]
  links: Link[]
}

type Props = {
  section: Section
  uploading: boolean
  linkSaving: boolean
  linkForm: { title: string; url: string; order: string }
  onUpload: (event: FormEvent<HTMLFormElement>) => void
  onAddLink: (event: FormEvent<HTMLFormElement>) => void
  onDeleteFile: (id: string) => void
  onDeleteLink: (id: string) => void
  onLinkFormChange: (value: { title: string; url: string; order: string }) => void
}

export default function ModuleContentManager({ section, uploading, linkSaving, linkForm, onUpload, onAddLink, onDeleteFile, onDeleteLink, onLinkFormChange }: Props) {
  const total = section.files.length + section.links.length

  return <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex flex-col gap-2 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-cyan-700">Contenido del módulo</p><h2 className="mt-1 text-xl font-bold text-slate-900">Imágenes, archivos y enlaces</h2><p className="mt-1 text-sm text-slate-500">Todo lo que subas aquí se publicará en este mismo módulo.</p></div><span className="w-fit rounded-full bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700">{total} {total === 1 ? 'elemento' : 'elementos'}</span></div>

    <div className="grid gap-6 lg:grid-cols-2"><form onSubmit={onUpload} className="rounded-xl border border-slate-200 bg-slate-50 p-4"><h3 className="font-semibold text-slate-900">1. Subir imagen o archivo</h3><p className="mt-1 text-sm text-slate-500">Puedes adjuntar imágenes, PDF u otros entregables.</p><label className="mt-4 block text-sm font-medium text-slate-700">Archivo<input name="file" type="file" accept="image/*,.pdf,.pbix,.doc,.docx" className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2 text-sm" required /></label><button type="submit" disabled={uploading} className="mt-4 rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:opacity-60">{uploading ? 'Subiendo...' : 'Subir al módulo'}</button></form><form onSubmit={onAddLink} className="rounded-xl border border-slate-200 bg-slate-50 p-4"><h3 className="font-semibold text-slate-900">2. Agregar enlace</h3><p className="mt-1 text-sm text-slate-500">El enlace se mostrará junto a las imágenes de este módulo.</p><div className="mt-4 grid gap-3"><input value={linkForm.title} onChange={(event) => onLinkFormChange({ ...linkForm, title: event.target.value })} placeholder="Título del enlace" className="w-full rounded-lg border border-slate-300 bg-white p-2 text-sm" required /><input type="url" value={linkForm.url} onChange={(event) => onLinkFormChange({ ...linkForm, url: event.target.value })} placeholder="https://..." className="w-full rounded-lg border border-slate-300 bg-white p-2 text-sm" required /><input type="number" value={linkForm.order} onChange={(event) => onLinkFormChange({ ...linkForm, order: event.target.value })} aria-label="Orden del enlace" className="w-24 rounded-lg border border-slate-300 bg-white p-2 text-sm" /><button type="submit" disabled={linkSaving} className="w-fit rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60">{linkSaving ? 'Agregando...' : 'Agregar al módulo'}</button></div></form></div>

    <div><h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Vista conjunta</h3>{total === 0 ? <p className="mt-3 rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">Aún no publicaste imágenes ni enlaces en este módulo.</p> : <div className="mt-3 grid gap-4 md:grid-cols-2">{section.files.map((file) => { const image = file.mimeType.startsWith('image/'); return <article key={file.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white"><div className="flex min-h-28 items-center justify-center bg-slate-100">{image ? <img src={`/uploads/${file.filename}`} alt={file.originalName} className="h-32 w-full object-cover" /> : <span className="text-sm font-semibold text-slate-500">Archivo</span>}</div><div className="flex items-center justify-between gap-3 p-3"><span className="min-w-0"><span className="block truncate text-sm font-semibold text-slate-800">{file.originalName}</span><span className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</span></span><button onClick={() => onDeleteFile(file.id)} className="text-sm font-semibold text-red-600 hover:text-red-700">Eliminar</button></div></article>})}{section.links.map((link) => <article key={link.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4"><span className="min-w-0"><span className="block truncate text-sm font-semibold text-slate-800">{link.title}</span><a href={link.url} target="_blank" rel="noreferrer" className="block truncate text-xs text-cyan-700 hover:underline">{link.url}</a></span><button onClick={() => onDeleteLink(link.id)} className="shrink-0 text-sm font-semibold text-red-600 hover:text-red-700">Eliminar</button></article>)}</div>}</div>
  </section>
}
