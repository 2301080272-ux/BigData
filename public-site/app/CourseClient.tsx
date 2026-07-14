'use client'

import { useState } from 'react'

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
  files: FileItem[]
  links: Link[]
}

type CourseClientProps = {
  sections: Section[]
}

export default function CourseClient({ sections }: CourseClientProps) {
  const [selectedContent, setSelectedContent] = useState<{ type: 'pdf' | 'image' | 'module' | 'link'; title: string; url?: string; section?: Section }>({
    type: 'module',
    title: sections.length > 0 ? sections[0].title : 'Sin contenido'
  })

  const [expandedModules, setExpandedModules] = useState<string[]>(sections.length > 0 ? [sections[0].id] : [])

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return (
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'pdf':
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        )
      case 'quiz':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        )
      case 'document':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case 'image':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      case 'link':
        return (
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        )
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="flex-1 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-600">Viendo actualmente: {selectedContent.title}</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Módulos del Curso</h3>
            
            {sections.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm">No hay módulos disponibles</p>
                <p className="text-gray-500 text-xs mt-2">Los administradores aún no han creado contenido</p>
              </div>
            ) : (
              sections.map((section) => (
                <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleModule(section.id)}
                    className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
                  >
                    <span className="font-medium text-gray-900">{section.title}</span>
                    <svg 
                      className={`w-4 h-4 text-gray-500 transition-transform ${expandedModules.includes(section.id) ? 'rotate-90' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {expandedModules.includes(section.id) && (
                    <div className="bg-white">
                      {/* Mostrar archivos */}
                      {section.files.map((file) => (
                        <button
                          key={file.id}
                          onClick={() => {
                          const isImage = file.mimeType.startsWith('image/')
                          const isPdf = file.mimeType === 'application/pdf'
                          setSelectedContent({
                            type: isImage ? 'image' : isPdf ? 'pdf' : 'module',
                            title: file.originalName,
                            url: `/api/uploads/${file.filename}`,
                            section: section
                          })
                        }}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-purple-50 transition-colors border-t border-gray-100"
                        >
                          {getLessonIcon(file.mimeType === 'application/pdf' ? 'pdf' : file.mimeType.startsWith('image/') ? 'image' : 'document')}
                          <span className="text-sm text-gray-700 text-left">
                            <div className="font-medium">{file.originalName}</div>
                            <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                          </span>
                        </button>
                      ))}
                      
                      {/* Mostrar enlaces */}
                      {section.links.map((link) => (
                        <button
                          key={link.id}
                          onClick={() => setSelectedContent({
                            type: 'link',
                            title: link.title,
                            url: link.url,
                            section: section
                          })}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-purple-50 transition-colors border-t border-gray-100"
                        >
                          {getLessonIcon('link')}
                          <span className="text-sm text-gray-700 text-left">
                            <div className="font-medium">{link.title}</div>
                            <div className="text-xs text-gray-500">Enlace externo</div>
                          </span>
                        </button>
                      ))}
                      
                      {section.files.length === 0 && section.links.length === 0 && (
                        <div className="px-4 py-3 text-sm text-gray-500 border-t border-gray-100">
                          Sin contenido disponible
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white">
        <div className="h-full flex flex-col">
          {/* Content Header */}
          <div className="border-b border-gray-200 px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900">{selectedContent.title}</h1>
          </div>

          {/* Content Display */}
          <div className="flex-1 p-8">
            {selectedContent.type === 'image' ? (
              <div className="h-full flex flex-col">
                {/* Image Viewer */}
                <div className="flex-1 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">Imagen</span>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Vista previa</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a 
                        href={selectedContent.url}
                        download
                        className="px-4 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                      >
                        Descargar Imagen
                      </a>
                    </div>
                  </div>
                  
                  {/* Image Content */}
                  <div className="flex-1 p-8">
                    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                      <div className="p-8">
                        <img
                          src={selectedContent.url}
                          alt={selectedContent.title}
                          className="w-full h-auto rounded-lg shadow-md"
                          style={{ maxHeight: '600px', objectFit: 'contain' }}
                        />
                      </div>
                      <div className="bg-gray-50 px-8 py-4 border-t">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">
                            Si la imagen no se visualiza correctamente, 
                            <a 
                              href={selectedContent.url} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-700 font-medium ml-1"
                            >
                              ábrela en una nueva pestaña
                            </a>
                            {' '}o{' '}
                            <a 
                              href={selectedContent.url}
                              download
                              className="text-purple-600 hover:text-purple-700 font-medium ml-1"
                            >
                              descárgala
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedContent.type === 'pdf' ? (
              <div className="h-full flex flex-col">
                {/* PDF Viewer */}
                <div className="flex-1 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">Documento PDF</span>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Página 1</span>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a 
                        href={selectedContent.url}
                        download
                        className="px-4 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                      >
                        Descargar PDF
                      </a>
                    </div>
                  </div>
                  
                  {/* PDF Content */}
                  <div className="flex-1 p-8">
                    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                      <div className="p-8">
                        <iframe
                          src={selectedContent.url}
                          className="w-full h-96 border-0 rounded-lg"
                          title="PDF Viewer"
                        >
                          <div className="text-center py-12">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Visor de PDF</h3>
                            <p className="text-gray-600 mb-4">Tu navegador no puede mostrar este PDF.</p>
                            <a 
                              href={selectedContent.url}
                              download
                              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Descargar PDF
                            </a>
                          </div>
                        </iframe>
                      </div>
                      <div className="bg-gray-50 px-8 py-4 border-t">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">
                            Si el PDF no se visualiza correctamente, 
                            <a 
                              href={selectedContent.url} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-700 font-medium ml-1"
                            >
                              abre en una nueva pestaña
                            </a>
                            {' '}o{' '}
                            <a 
                              href={selectedContent.url}
                              download
                              className="text-purple-600 hover:text-purple-700 font-medium ml-1"
                            >
                              descárgalo
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedContent.type === 'link' ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedContent.title}</h3>
                  <p className="text-gray-600 mb-4">Este es un enlace externo</p>
                  <a 
                    href={selectedContent.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Abrir Enlace
                  </a>
                </div>
              </div>
            ) : selectedContent.section ? (
              <div className="space-y-8">
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedContent.section.title}</h2>
                  {selectedContent.section.body && (
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {selectedContent.section.body}
                    </p>
                  )}
                </div>
                
                {selectedContent.section.files.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Archivos del Módulo</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedContent.section.files.map((file) => (
                        <div key={file.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3">
                            {getLessonIcon(file.mimeType === 'application/pdf' ? 'pdf' : 'document')}
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{file.originalName}</p>
                              <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                            <a
                              href={`/api/uploads/${file.filename}`}
                              download={file.originalName}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedContent.section.links.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Enlaces del Módulo</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedContent.section.links.map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow block"
                        >
                          <div className="flex items-center gap-3">
                            {getLessonIcon('link')}
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{link.title}</p>
                              <p className="text-sm text-gray-500 truncate">{link.url}</p>
                            </div>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Contenido del Módulo</h3>
                  <p className="text-gray-600">Selecciona un archivo o enlace de la barra lateral para ver el contenido</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
