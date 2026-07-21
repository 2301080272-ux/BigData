'use client'

type FileItem = {
  id: string
  filename: string
  originalName: string
  mimeType: string
}

type Section = {
  id: string
  title: string
  body: string
  isAchievement?: boolean
  files: FileItem[]
  links: { id: string; title: string; url: string }[]
}

export default function PowerBiAchievements({ sections, onOpen }: { sections: Section[]; onOpen: (section: Section) => void }) {
  const courses = sections.filter((section) => section.isAchievement === true)
  const displayCourses = courses
  const certificate = displayCourses.flatMap((section) => section.files).find((file) => file.mimeType.startsWith('image/'))

  return <section className="min-h-[calc(100vh-4rem)] bg-slate-950 pb-16 text-white">
    <div className="relative overflow-hidden border-b border-white/10" style={{ backgroundImage: 'linear-gradient(90deg, rgba(2,6,23,.97), rgba(2,6,23,.72)), url(/uploads/bigdata-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.2fr_.8fr] lg:items-center lg:py-20">
        <div><p className="inline-flex rounded-full border border-yellow-300/25 bg-yellow-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[.18em] text-yellow-200">Trayectoria Power BI</p><h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">Cursos y logros que convierten datos en <span className="text-cyan-300">información útil.</span></h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Este espacio reúne exclusivamente las imágenes y enlaces publicados en el módulo Logros Curso PowerBI.</p><div className="mt-8 flex flex-wrap gap-4"><div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-slate-900/70 p-3 pr-5 backdrop-blur"><img src="/uploads/student-photo.jpg" alt="Reyna Saravia Andrea" className="h-11 w-11 rounded-xl object-cover ring-2 ring-cyan-300" /><span><span className="block text-xs text-slate-400">Estudiante</span><span className="block text-sm font-bold">Reyna Saravia Andrea</span></span></div><div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-slate-900/70 p-3 pr-5 backdrop-blur"><img src="/uploads/teacher-photo.jpg" alt="Claudio Isaias Huancahuire Bravo" className="h-11 w-11 rounded-xl object-cover ring-2 ring-yellow-300" /><span><span className="block text-xs text-slate-400">Docente</span><span className="block text-sm font-bold">Claudio Huancahuire</span></span></div></div></div>
        <div className="relative mx-auto w-full max-w-md"><div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-cyan-400/30 to-yellow-300/20 blur-2xl" /><div className="relative overflow-hidden rounded-3xl border border-white/20 bg-slate-900/80 p-4 shadow-2xl backdrop-blur"><div className="flex items-center justify-between border-b border-white/10 px-2 pb-3"><span className="text-sm font-semibold">Power BI Learning Path</span><span className="rounded-full bg-yellow-300 px-2 py-1 text-xs font-bold text-slate-950">LOGRO</span></div>{certificate ? <img src={`/api/uploads/${certificate.filename}`} alt="Evidencia de logro Power BI" className="mt-4 aspect-video w-full rounded-2xl object-cover" /> : <div className="mt-4 grid aspect-video place-items-center rounded-2xl bg-gradient-to-br from-yellow-300 to-amber-500 p-8 text-center text-slate-950"><span><span className="text-5xl">✦</span><span className="mt-3 block text-xl font-bold">Power BI</span><span className="block text-sm">Cursos completados</span></span></div>}<div className="grid grid-cols-2 gap-3 pt-4"><div className="rounded-xl bg-white/5 p-3"><span className="block text-2xl font-bold text-cyan-300">{displayCourses.length}</span><span className="text-xs text-slate-400">cursos y logros</span></div><div className="rounded-xl bg-white/5 p-3"><span className="block text-2xl font-bold text-yellow-200">2026</span><span className="text-xs text-slate-400">año académico</span></div></div></div></div>
      </div>
    </div>
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-[.18em] text-cyan-300">Evidencias de aprendizaje</p><h2 className="mt-2 text-3xl font-bold">Cursos realizados en Power BI</h2></div><p className="text-sm text-slate-400">Cada logro muestra su imagen y enlace asociado.</p></div><div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{displayCourses.map((course, index) => { const image = course.files.find((file) => file.mimeType.startsWith('image/')); const link = course.links[0]; return <button key={course.id} onClick={() => onOpen(course)} className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-900 text-left transition hover:-translate-y-1 hover:border-cyan-300/60 hover:shadow-2xl hover:shadow-cyan-500/10"><div className={`h-2 ${index % 2 === 0 ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-gradient-to-r from-yellow-300 to-orange-500'}`} /><div className="p-6"><div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-lg font-bold text-cyan-300">{String(index + 1).padStart(2, '0')}</span><span className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-slate-300">Power BI</span></div><h3 className="mt-6 text-xl font-bold">{course.title}</h3><p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-400">{course.body || 'Consulta las evidencias de este curso realizado.'}</p>{image && <div className="mt-4 rounded-xl overflow-hidden border border-white/10 bg-slate-800"><img src={`/api/uploads/${image.filename}`} alt={image.originalName} className="h-32 w-full object-cover" /></div>}{link && <div className="mt-3 flex items-center gap-2 text-sm text-cyan-300"><span className="truncate font-medium">{link.title}</span><span className="text-slate-500">→</span></div>}<div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-sm"><span className="text-slate-400">{course.files.length} imágenes · {course.links.length} enlaces</span><span className="font-bold text-cyan-300 transition group-hover:translate-x-1">Ver logro →</span></div></div></button>})}</div>{displayCourses.length === 0 && <div className="mt-8 rounded-3xl border border-dashed border-white/20 bg-slate-900 p-10 text-center text-slate-400">El módulo “Logros Curso PowerBI” aún no tiene contenido publicado.</div>}</div>
  </section>
}
