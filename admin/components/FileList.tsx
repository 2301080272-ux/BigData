import Link from 'next/link'

type FileItem = {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  sectionId: string
  section?: { title: string }
}

type Props = {
  files: FileItem[]
  onDelete?: (id: string) => void
}

export default function FileList({ files, onDelete }: Props) {
  if (files.length === 0) {
    return <p className="text-gray-500">No hay archivos.</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((file) => (
        <div key={file.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
          {file.mimeType.startsWith('image/') ? (
            <a href={`/uploads/${file.filename}`} target="_blank" rel="noopener noreferrer">
              <img
                src={`/uploads/${file.filename}`}
                alt={file.originalName}
                className="h-32 w-full object-cover rounded mb-3"
              />
            </a>
          ) : (
            <div className="h-32 w-full bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-500 text-sm">
              {file.mimeType.split('/').pop()?.toUpperCase() || 'Archivo'}
            </div>
          )}
          <p className="text-sm font-medium truncate" title={file.originalName}>
            {file.originalName}
          </p>
          <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
          {file.section && (
            <p className="text-xs text-gray-400 mt-1">Apartado: {file.section.title}</p>
          )}
          <div className="mt-3 flex gap-2">
            <a
              href={`/uploads/${file.filename}`}
              download={file.originalName}
              className="text-xs text-blue-600 hover:underline"
            >
              Descargar
            </a>
            {onDelete && (
              <button
                onClick={() => onDelete(file.id)}
                className="text-xs text-red-600 hover:underline"
              >
                Eliminar
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
