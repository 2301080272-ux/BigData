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

type Content = {
  sections: Section[]
  publishedAt: string | null
}

'use client'

import { useState } from 'react'
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

type Content = {
  sections: Section[]
  publishedAt: string | null
}

export default function HomePage() {
  const [selectedContent, setSelectedContent] = useState<{ type: 'pdf' | 'module'; title: string; url?: string; module?: Section }>({
    type: 'pdf',
    title: 'Marketing Strategy PDF',
    url: '/uploads/1783999307166-baseTL.pbix'
  })

  const [expandedModules, setExpandedModules] = useState<string[]>(['module-1'])

  // Mock data for course structure
  const courseModules = [
    {
      id: 'module-1',
      title: 'Module 1: Introduction',
      lessons: [
        { id: 'lesson-1', title: 'Lesson 1: Video', type: 'video' },
        { id: 'lesson-2', title: 'Lesson 2: Documents', type: 'documents' },
        { id: 'lesson-3', title: 'Lesson 3: Quiz', type: 'quiz' }
      ]
    },
    {
      id: 'module-2',
      title: 'Module 2: Marketing Strategy',
      lessons: [
        { id: 'lesson-3', title: 'Marketing Strategy PDF', type: 'pdf', active: true }
      ]
    },
    {
      id: 'module-3',
      title: 'Module 3: Core Concepts',
      lessons: [
        { id: 'lesson-4', title: 'Lesson 1 Video', type: 'video' },
        { id: 'lesson-5', title: 'Quiz 1', type: 'quiz' },
        { id: 'lesson-6', title: 'Resource Document', type: 'document' },
        { id: 'lesson-7', title: 'Lesson 3 Video', type: 'video' },
        { id: 'lesson-8', title: 'Quiz 2', type: 'quiz' },
        { id: 'lesson-9', title: 'Resource Document', type: 'document' }
      ]
    },
    {
      id: 'module-4',
      title: 'Module 4: Design',
      lessons: [
        { id: 'lesson-10', title: 'Design Principles', type: 'video' }
      ]
    }
  ]

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
      default:
        return (
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        )
    }
  }

  return (
    <div className="flex-1 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">PUBLIC STUDENT VIEW</h2>
            <p className="text-sm text-gray-600">Currently Viewing: {selectedContent.title}</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Course Modules</h3>
            
            {courseModules.map((module) => (
              <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
                >
                  <span className="font-medium text-gray-900">{module.title}</span>
                  <svg 
                    className={`w-4 h-4 text-gray-500 transition-transform ${expandedModules.includes(module.id) ? 'rotate-90' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {expandedModules.includes(module.id) && (
                  <div className="bg-white">
                    {module.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => setSelectedContent({
                          type: lesson.type === 'pdf' ? 'pdf' : 'module',
                          title: lesson.title,
                          url: lesson.type === 'pdf' ? '/uploads/1783999307166-baseTL.pbix' : undefined
                        })}
                        className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-purple-50 transition-colors border-t border-gray-100 ${
                          lesson.active ? 'bg-purple-50 border-l-4 border-l-purple-600' : ''
                        }`}
                      >
                        {getLessonIcon(lesson.type)}
                        <span className={`text-sm ${lesson.active ? 'text-purple-900 font-medium' : 'text-gray-700'}`}>
                          {lesson.title}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
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
            {selectedContent.type === 'pdf' ? (
              <div className="h-full flex flex-col">
                {/* PDF Viewer */}
                <div className="flex-1 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">Marketing Plan</span>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Page 1 of 10</span>
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
                      <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors">
                        Previous Lesson
                      </button>
                      <a 
                        href={selectedContent.url}
                        download
                        className="px-4 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                      >
                        Download PDF
                      </a>
                      <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors">
                        Next Lesson
                      </button>
                    </div>
                  </div>
                  
                  {/* PDF Content Mock */}
                  <div className="flex-1 p-8">
                    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-12">
                      <h2 className="text-3xl font-bold text-gray-900 mb-8">Marketing Plan</h2>
                      
                      <div className="space-y-6">
                        <section>
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">Introduction</h3>
                          <p className="text-gray-700 leading-relaxed">
                            This comprehensive marketing plan outlines our strategic approach to market penetration, 
                            brand development, and customer acquisition in the competitive landscape.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">Contents</h3>
                          <ul className="space-y-2 text-gray-700">
                            <li>• Executive Summary</li>
                            <li>• Market Analysis</li>
                            <li>• Target Audience</li>
                            <li>• Marketing Strategies</li>
                            <li>• Budget Allocation</li>
                            <li>• Performance Metrics</li>
                          </ul>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">Marketing Plan Concepts</h3>
                          <p className="text-gray-700 leading-relaxed">
                            Our marketing strategy is built upon core principles of customer-centric approach, 
                            data-driven decision making, and innovative brand positioning...
                          </p>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Module Content</h3>
                  <p className="text-gray-600">Select a lesson from the sidebar to view content</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
