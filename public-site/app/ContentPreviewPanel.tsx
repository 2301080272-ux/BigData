'use client'

import { useMemo, useState } from 'react'

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
}

type Section = {
  title: string
  body: string
  files: FileItem[]
  links: Link[]
}

type Resource =
  | { kind: 'file'; id: string; title: string; url: string; mimeType: string; size: number }
  | { kind: 'link'; id: string; title: string; url: string }

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function ResourceIcon({ type }: { type: 'file' | 'image' | 'link' | 'download' | 'close' | 'external' }) {
  const props = { className: 'h-5 w-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', strokeWidth: 1.8 }
  if (type === 'image') return <svg {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8" cy="10" r="1" /><path strokeLinecap="round" strokeLinejoin="round" d="m21 15-4-4L5 19" /></svg>
  if (type === 'link' || type === 'external') return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5h5v5m0-5-9 9M19 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4" /></svg>
  if (type === 'download') return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" /></svg>
  if (type === 'close') return <svg {...props}><path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" /></svg>
  return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6M8 13h8M8 17h5" /></svg>
}

export default function ContentPreviewPanel({ section, onClose }: { section: Section; onClose: () => void }) {
  const resources = useMemo<Resource[]>(() => [
    ...section.files.map((file) => ({ kind: 'file' as const, id: file.id, title: file.originalName, url: `/api/uploads/${file.filename}`, mimeType: file.mimeType, size: file.size })),
    ...section.links.map((link) => ({ kind: 'link' as const, id: link.id, title: link.title, url: link.url })),
  ], [section])
  const [selectedId, setSelectedId] = useState(resources[0]?.id ?? '')
  const selected = resources.find((resource) => resource.id === selectedId)

  return <div className="fixed inset-0 z-50 bg-slate-950/55 p-0 backdrop-blur-sm lg:p-5" role="dialog" aria-modal="true" aria-label={`Contenido de ${section.title}`}>
    <div className="mx-auto flex h-full max-w-7xl flex-col overflow-hidden bg-white shadow-2xl dark:bg-slate-950 lg:rounded-3xl">
      <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-7">
        <div><p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-700 dark:text-cyan-400">Repositorio · módulo</p><h2 className="mt-1 text-xl font-bold sm:text-2xl">{section.title}</h2></div>
        <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Cerrar contenido"><ResourceIcon type="close" /></button>
      </div>
      <div className="grid min-h-0 flex-1 lg:grid-cols-[19rem_minmax(0,1fr)]">
        <aside className="border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <p className="mb-4 text-sm leading-6 text-slate-600 dark:text-slate-400">{section.body || 'Selecciona una evidencia para revisarla.'}</p>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Materiales ({resources.length})</p>
          <div className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-2 lg:overflow-visible">
            {resources.map((resource) => {
              const active = resource.id === selectedId
              const image = resource.kind === 'file' && resource.mimeType.startsWith('image/')
              return <button key={resource.id} onClick={() => setSelectedId(resource.id)} className={`flex min-w-56 items-center gap-3 rounded-xl p-3 text-left transition lg:w-full lg:min-w-0 ${active ? 'bg-cyan-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-cyan-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-800'}`}><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${active ? 'bg-white/15' : 'bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300'}`}><ResourceIcon type={resource.kind === 'link' ? 'link' : image ? 'image' : 'file'} /></span><span className="min-w-0"><span className="block truncate text-sm font-semibold">{resource.title}</span><span className={`block text-xs ${active ? 'text-cyan-100' : 'text-slate-500 dark:text-slate-400'}`}>{resource.kind === 'link' ? 'Enlace externo' : formatFileSize(resource.size)}</span></span></button>
            })}
            {resources.length === 0 && <p className="rounded-xl bg-white p-4 text-sm text-slate-500 dark:bg-slate-800">Aún no hay materiales publicados.</p>}
          </div>
        </aside>
        <section className="min-h-0 bg-slate-100 p-3 dark:bg-slate-900 sm:p-5">
          {selected ? <Preview resource={selected} section={section} /> : <div className="grid h-full min-h-80 place-items-center rounded-2xl border border-dashed border-slate-300 bg-white text-center text-slate-500 dark:border-slate-700 dark:bg-slate-950"><div><ResourceIcon type="file" /><p className="mt-3 font-medium">No hay evidencia para mostrar</p></div></div>}
        </section>
      </div>
    </div>
  </div>
}

function Preview({ resource, section }: { resource: Resource; section: Section }) {
  const isImage = resource.kind === 'file' && resource.mimeType.startsWith('image/')
  const isPdf = resource.kind === 'file' && resource.mimeType === 'application/pdf'
  const title = resource.kind === 'link' ? 'Vista previa del enlace' : isImage ? 'Vista previa de imagen' : isPdf ? 'Vista previa de PDF' : 'Archivo descargable'
  const relatedLink = section.links[0]

  return <div className="flex h-full min-h-[28rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3 dark:border-slate-800"><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">{title}</p><p className="truncate text-sm font-semibold">{resource.title}</p></div><a href={resource.url} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-cyan-700 dark:bg-cyan-600"><ResourceIcon type={resource.kind === 'file' ? 'download' : 'external'} />{resource.kind === 'file' ? 'Abrir / descargar' : 'Abrir enlace'}</a></div>
    <div className="min-h-0 flex-1 bg-slate-100 dark:bg-slate-900">
      {isImage && <div className="flex h-full min-h-[24rem] flex-col items-center justify-center p-5"><img src={resource.url} alt={resource.title} className="max-h-[65vh] max-w-full rounded-xl object-contain shadow-lg" />{relatedLink && <div className="mt-4 flex items-center gap-2 text-sm text-cyan-700"><a href={relatedLink.url} target="_blank" rel="noreferrer" className="font-medium hover:underline">{relatedLink.title}</a><span className="text-slate-500">→</span></div>}</div>}
      {isPdf && <iframe src={resource.url} title={resource.title} className="h-full min-h-[31rem] w-full bg-white" />}
      {resource.kind === 'link' && <div className="relative h-full min-h-[31rem]"><iframe src={resource.url} title={resource.title} className="h-full w-full bg-white" sandbox="allow-scripts allow-forms allow-popups allow-same-origin" /><div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-950/85 px-4 py-2 text-center text-xs text-white shadow-lg">Si el sitio bloquea la vista previa, usa "Abrir enlace".</div></div>}
      {resource.kind === 'file' && !isImage && !isPdf && <div className="grid h-full min-h-[24rem] place-items-center p-6 text-center"><div className="max-w-sm"><span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300"><ResourceIcon type="file" /></span><h3 className="mt-5 text-lg font-bold">Vista previa no disponible</h3><p className="mt-2 text-sm leading-6 text-slate-500">Este formato necesita una aplicación compatible para abrirse. Puedes descargarlo desde el botón superior.</p></div></div>}
    </div>
  </div>
}
