import Link from 'next/link'

type Section = {
  id: string
  title: string
  slug: string
  body: string
  order: number
  files: { id: string }[]
  links: { id: string }[]
}

type Props = {
  section: Section
  onDelete: (id: string) => void
}

export default function SectionCard({ section, onDelete }: Props) {
  return (
    <article className="bg-white rounded-lg shadow p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
      <div className="flex-1">
        <h3 className="text-lg font-bold">{section.title}</h3>
        <p className="text-sm text-gray-500">/{section.slug} · orden {section.order}</p>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{section.body}</p>
        <p className="text-xs text-gray-400 mt-2">
          {section.files.length} archivo{section.files.length === 1 ? '' : 's'} ·{' '}
          {section.links.length} enlace{section.links.length === 1 ? '' : 's'}
        </p>
      </div>
      <div className="flex md:flex-col gap-2 shrink-0">
        <Link
          href={`/sections/${section.id}`}
          className="text-sm text-center px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Gestionar contenido
        </Link>
        <button
          onClick={() => onDelete(section.id)}
          className="text-sm px-3 py-1.5 rounded border border-red-600 text-red-600 hover:bg-red-50"
        >
          Eliminar
        </button>
      </div>
    </article>
  )
}
