import fs from 'fs/promises'
import path from 'path'

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

type Content = {
  sections: Section[]
  publishedAt: string | null
}

export default async function HomePage() {
  const contentPath = path.join(process.cwd(), 'content.json')
  const raw = await fs.readFile(contentPath, 'utf-8')
  const content: Content = JSON.parse(raw)

  return (
    <main className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Sitio Público</h1>
      {content.publishedAt && (
        <p className="text-sm text-gray-500 mb-8">
          Última publicación: {new Date(content.publishedAt).toLocaleString('es-ES')}
        </p>
      )}

      {content.sections.length === 0 ? (
        <p className="text-gray-600">Aún no hay contenido publicado.</p>
      ) : (
        <div className="space-y-8">
          {content.sections.map((section) => (
            <section key={section.id} id={section.slug} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-2">{section.title}</h2>
              <p className="whitespace-pre-wrap">{section.body}</p>

              {section.files.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold text-sm mb-2">Archivos:</h3>
                  <ul className="space-y-2">
                    {section.files.map((file) => (
                      <li key={file.id}>
                        <a
                          href={`/uploads/${file.filename}`}
                          download={file.originalName}
                          className="text-blue-600 hover:underline"
                        >
                          {file.originalName}
                        </a>
                        <span className="text-sm text-gray-500 ml-2">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </main>
  )
}
