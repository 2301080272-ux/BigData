import { prisma } from '@/lib/prisma'
import Link from 'next/link'

type SectionWithFiles = {
  id: string
  title: string
  slug: string
  body: string
  order: number
  files: { id: string }[]
}

export default async function DashboardPage() {
  const sections = (await prisma.section.findMany({
    include: { files: { select: { id: true } } },
    orderBy: { createdAt: 'desc' },
  })) as SectionWithFiles[]
  const totalFiles = await prisma.file.count()

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-5xl font-bold gradient-text">Panel de Administración</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Conectado</span>
            </div>
          </div>
          <p className="text-xl text-gray-600 mb-6">
            Gestiona el contenido del repositorio de Big Data
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 mb-2">Apartados</p>
            <p className="text-4xl font-bold text-gray-900">{sections.length}</p>
          </div>
          
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 mb-2">Archivos</p>
            <p className="text-4xl font-bold text-gray-900">{totalFiles}</p>
          </div>
          
          <div className="card p-8 flex items-center justify-between group cursor-pointer card-hover">
            <div>
              <p className="text-sm text-gray-500 mb-2">Acción rápida</p>
              <p className="text-xl font-semibold text-gray-900">Publicar sitio</p>
              <p className="text-sm text-gray-600 mt-1">Actualizar contenido público</p>
            </div>
            <Link
              href="/publish"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              Publicar
            </Link>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full"></div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Apartados recientes</h2>
                <p className="text-gray-600 mt-1">Gestiona tus secciones de contenido</p>
              </div>
            </div>
            <Link href="/sections/new" className="btn-primary">
              + Nuevo apartado
            </Link>
          </div>
          
          {sections.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay apartados aún</h3>
              <p className="text-gray-600 mb-6">Crea tu primer apartado para comenzar a gestionar contenido.</p>
              <Link href="/sections/new" className="btn-primary">
                Crear primer apartado
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sections.slice(0, 6).map((section) => (
                <div key={section.id} className="card card-hover p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{section.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          /{section.slug}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                          {section.files.length} archivos
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/sections/${section.id}`}
                          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </Link>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
