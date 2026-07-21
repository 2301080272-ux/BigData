'use client'

import { useMemo, useState } from 'react'
import ThemeToggle from './components/ThemeToggle'
import ContentPreviewPanel from './ContentPreviewPanel'
import PowerBiAchievements from './PowerBiAchievements'

type FileItem = {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  sectionId: string
}

type Link = {
  id: string
  title: string
  url: string
  order: number
  sectionId: string
}

type Section = {
  id: string
  title: string
  slug: string
  body: string
  order: number
  isAchievement?: boolean
  files: FileItem[]
  links: Link[]
}

type Props = {
  sections: Section[]
}

type View = 'inicio' | 'explorar' | 'logros'

const navItems: { id: View; label: string }[] = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'explorar', label: 'Repositorio' },
  { id: 'logros', label: 'Logros' },
]

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function fileUrl(file: FileItem) {
  return `/api/uploads/${file.filename}`
}

function Icon({ name, className = 'h-5 w-5' }: { name: 'arrow' | 'book' | 'download' | 'external' | 'file' | 'image' | 'layers' | 'search' | 'spark' | 'close'; className?: string }) {
  const common = { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', strokeWidth: 1.8 }
  if (name === 'arrow') return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" /></svg>
  if (name === 'book') return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 7H20v13H6.5A2.5 2.5 0 0 0 4 22V4.5Z" /></svg>
  if (name === 'download') return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" /></svg>
  if (name === 'external') return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5h5v5m0-5-9 9M19 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4" /></svg>
  if (name === 'image') return <svg {...common}><rect width="18" height="14" x="3" y="5" rx="2" /><circle cx="8" cy="10" r="1" /><path strokeLinecap="round" strokeLinejoin="round" d="m21 15-4-4L5 19" /></svg>
  if (name === 'layers') return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5" /></svg>
  if (name === 'search') return <svg {...common}><circle cx="11" cy="11" r="6" /><path strokeLinecap="round" d="m20 20-4.2-4.2" /></svg>
  if (name === 'spark') return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="m12 3-1.4 5.6L5 10l5.6 1.4L12 17l1.4-5.6L19 10l-5.6-1.4L12 3ZM5 16l-.7 2.3L2 19l2.3.7L5 22l.7-2.3L8 19l-2.3-.7L5 16Z" /></svg>
  if (name === 'close') return <svg {...common}><path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" /></svg>
  return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6M8 13h8M8 17h5" /></svg>
}

export default function PortfolioExperience({ sections }: Props) {
  const [view, setView] = useState<View>('inicio')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Section | null>(null)

  const stats = useMemo(() => ({
    modules: sections.length,
    evidence: sections.reduce((total, section) => total + section.files.length, 0),
    resources: sections.reduce((total, section) => total + section.links.length, 0),
  }), [sections])

  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase()
    if (!term) return sections
    return sections.filter((section) => `${section.title} ${section.body}`.toLocaleLowerCase().includes(term))
  }, [query, sections])

  const achievements = sections.filter((section) => /logro|certific|curso/i.test(`${section.title} ${section.body}`))
  const featured = sections[0]

  const openRepository = () => {
    setView('explorar')
    window.setTimeout(() => document.getElementById('repositorio')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }

  return (
    <main className="min-h-screen w-full flex-1 overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/85 text-white backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <button onClick={() => setView('inicio')} className="flex items-center gap-3 text-left" aria-label="Ir al inicio">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 font-bold shadow-lg shadow-cyan-500/30">RA</span>
            <span className="hidden sm:block"><span className="block text-sm font-semibold">Reyna Saravia</span><span className="block text-xs text-slate-400">Big Data Portfolio</span></span>
          </button>
          <nav className="flex items-center gap-1" aria-label="Navegación principal">
            {navItems.map((item) => <button key={item.id} onClick={() => setView(item.id)} className={`rounded-lg px-3 py-2 text-sm transition ${view === item.id ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>{item.label}</button>)}
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {view === 'inicio' && (
        <>
          <section className="relative isolate overflow-hidden bg-slate-950 px-5 pb-20 pt-16 text-white sm:px-8 sm:pb-28 sm:pt-24" style={{ backgroundImage: 'linear-gradient(90deg, rgba(2,6,23,.97), rgba(2,6,23,.78)), url(/uploads/bigdata-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}> 
            <div className="absolute inset-0 -z-10 opacity-60" style={{ backgroundImage: 'radial-gradient(circle at 20% 25%, #0e7490 0, transparent 31%), radial-gradient(circle at 80% 0%, #1d4ed8 0, transparent 28%)' }} />
            <div className="absolute -right-24 top-24 -z-10 h-80 w-80 rounded-full border border-cyan-300/20" />
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
              <div>
                <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100"><Icon name="spark" className="h-4 w-4" /> Portafolio académico · Big Data</p>
                <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">Datos que se convierten en <span className="text-cyan-300">decisiones.</span></h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Un repositorio interactivo de proyectos, entregables y aprendizajes desarrollados durante el curso de Big Data.</p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <button onClick={openRepository} className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950">Explorar repositorio <Icon name="arrow" className="h-5 w-5" /></button>
                  <button onClick={() => setView('logros')} className="rounded-xl border border-white/20 px-5 py-3 font-semibold text-white transition hover:bg-white/10">Ver logros</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-sm sm:p-6">
                <div className="col-span-2 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 p-5 text-slate-950"><Icon name="layers" className="mb-6 h-8 w-8" /><p className="text-4xl font-bold">{stats.modules}</p><p className="mt-1 font-medium">módulos documentados</p></div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-2xl font-bold text-cyan-300">{stats.evidence}</p><p className="mt-1 text-sm text-slate-300">evidencias</p></div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-2xl font-bold text-cyan-300">{stats.resources}</p><p className="mt-1 text-sm text-slate-300">recursos</p></div>
              </div>
            </div>
          </section>
          <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-[.2em] text-cyan-700 dark:text-cyan-400">Recorrido</p><h2 className="mt-2 text-3xl font-bold tracking-tight">Explora el trabajo del curso</h2></div><button onClick={openRepository} className="inline-flex items-center gap-2 font-semibold text-cyan-700 hover:text-cyan-600 dark:text-cyan-400">Ver todo <Icon name="arrow" className="h-5 w-5" /></button></div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {sections.slice(0, 3).map((section, index) => <button key={section.id} onClick={() => setSelected(section)} className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"><span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-50 font-bold text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">0{index + 1}</span><h3 className="mt-5 text-lg font-bold">{section.title}</h3><p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-slate-600 dark:text-slate-400">{section.body || 'Consulta los recursos y evidencias de este módulo.'}</p><span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-cyan-700 dark:text-cyan-400">Abrir módulo <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" /></span></button>)}
            </div>
          </section>
        </>
      )}

      {view === 'explorar' && <section id="repositorio" className="min-h-[calc(100vh-4rem)] bg-slate-950 px-5 py-12 text-white sm:px-8"><div className="mx-auto max-w-7xl"><div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-900 px-6 py-10 shadow-2xl sm:px-10" style={{ backgroundImage: 'linear-gradient(90deg, rgba(2,6,23,.96), rgba(8,47,73,.77)), url(/uploads/bigdata-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}><p className="text-sm font-semibold uppercase tracking-[.2em] text-cyan-300">Repositorio</p><h1 className="mt-3 text-3xl font-bold sm:text-4xl">Proyectos, entregables y recursos</h1><p className="mt-3 max-w-2xl text-slate-300">Encuentra cada evidencia del curso en un solo lugar.</p><label className="mt-7 flex max-w-xl items-center gap-3 rounded-xl bg-white px-4 py-3 text-slate-800 shadow-lg"><Icon name="search" className="h-5 w-5 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por proyecto o tema..." className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" /></label></div><div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map((section, index) => <ModuleCard key={section.id} section={section} index={index} onSelect={setSelected} />)}</div>{filtered.length === 0 && <div className="py-20 text-center"><Icon name="search" className="mx-auto h-10 w-10 text-slate-300" /><p className="mt-4 font-semibold">No encontramos resultados</p><button onClick={() => setQuery('')} className="mt-3 text-sm font-semibold text-cyan-300">Limpiar búsqueda</button></div>}</div></section>}

      {false && <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8"><div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]"><div className="rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-700 p-8 text-white sm:p-10"><Icon name="spark" className="h-10 w-10" /><p className="mt-10 text-sm font-semibold uppercase tracking-[.2em] text-cyan-100">Resultados del curso</p><h1 className="mt-3 text-4xl font-bold">Aprendizaje en evidencia.</h1><p className="mt-5 max-w-md leading-7 text-cyan-50">Cada documento, dashboard y recurso registra una etapa del recorrido académico en Big Data.</p><div className="mt-10 border-t border-white/25 pt-5 text-sm text-cyan-50">{stats.evidence} archivos disponibles para consultar y descargar.</div></div><div><p className="text-sm font-semibold uppercase tracking-[.2em] text-cyan-700 dark:text-cyan-400">Destacados</p><h2 className="mt-2 text-3xl font-bold">Logros y certificaciones</h2><div className="mt-6 space-y-4">{(achievements.length ? achievements : sections).map((section, index) => <button key={section.id} onClick={() => setSelected(section)} className="flex w-full items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-cyan-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-50 font-bold text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">{index + 1}</span><span className="min-w-0 flex-1"><span className="block font-bold">{section.title}</span><span className="mt-1 block truncate text-sm text-slate-500 dark:text-slate-400">{section.files.length} evidencias disponibles</span></span><Icon name="arrow" className="h-5 w-5 text-slate-400" /></button>)}</div></div></div></section>}

      {view === 'logros' && <PowerBiAchievements sections={sections} onOpen={(section) => setSelected(section as Section)} />}

      {selected && <ContentPreviewPanel section={selected} onClose={() => setSelected(null)} />}

      <footer className="border-t border-slate-200 bg-white px-5 py-8 dark:border-slate-800 dark:bg-slate-950 sm:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span>Portafolio académico · Big Data</span><span>Reyna Saravia Andrea · 2026</span></div></footer>
    </main>
  )
}

function ModuleCard({ section, index, onSelect }: { section: Section; index: number; onSelect: (section: Section) => void }) {
  const evidence = section.files.length + section.links.length
  return <button onClick={() => onSelect(section)} className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"><div className="flex items-start justify-between gap-4"><span className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">Módulo {String(index + 1).padStart(2, '0')}</span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">{evidence} {evidence === 1 ? 'recurso' : 'recursos'}</span></div><h2 className="mt-7 text-xl font-bold">{section.title}</h2><p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600 dark:text-slate-400">{section.body || 'Revisa los materiales vinculados a este módulo.'}</p><div className="mt-7 flex items-center gap-2 text-sm font-semibold text-cyan-700 dark:text-cyan-400"><Icon name="book" className="h-4 w-4" /> Ver contenido <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" /></div></button>
}

function DetailPanel({ section, onClose }: { section: Section; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 p-0 backdrop-blur-sm sm:p-4" role="dialog" aria-modal="true" aria-label={`Contenido de ${section.title}`}><div className="h-full w-full overflow-y-auto bg-white shadow-2xl dark:bg-slate-900 sm:max-w-2xl sm:rounded-3xl"><div className="sticky top-0 flex items-start justify-between border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:px-8"><div><p className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">Módulo</p><h2 className="mt-1 text-2xl font-bold">{section.title}</h2></div><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Cerrar"><Icon name="close" /></button></div><div className="px-6 py-7 sm:px-8"><p className="whitespace-pre-wrap leading-7 text-slate-600 dark:text-slate-300">{section.body || 'Este módulo contiene los recursos asociados al trabajo desarrollado.'}</p><div className="mt-8"><h3 className="text-lg font-bold">Evidencias</h3><div className="mt-4 space-y-3">{section.files.map((file) => { const image = file.mimeType.startsWith('image/'); return <div key={file.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-800"><span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300"><Icon name={image ? 'image' : 'file'} /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{file.originalName}</span><span className="text-xs text-slate-500">{formatFileSize(file.size)}</span></span><a href={fileUrl(file)} target="_blank" rel="noreferrer" className="rounded-lg p-2 text-cyan-700 transition hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-cyan-400/10" aria-label={`Abrir ${file.originalName}`}><Icon name={image ? 'external' : 'download'} /></a></div>})}{section.links.map((link) => <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-cyan-300 dark:border-slate-800"><span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300"><Icon name="external" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{link.title}</span><span className="block truncate text-xs text-slate-500">Recurso externo</span></span><Icon name="arrow" className="h-5 w-5 text-slate-400" /></a>)}{section.files.length === 0 && section.links.length === 0 && <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800">Aún no hay evidencias publicadas para este módulo.</p>}</div></div></div></div></div>
}
