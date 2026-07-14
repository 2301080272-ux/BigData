import fs from 'fs/promises'
import path from 'path'
import CourseClient from './CourseClient'

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

export default async function HomePage() {
  const contentPath = path.join(process.cwd(), 'content.json')
  const raw = await fs.readFile(contentPath, 'utf-8')
  const content: Content = JSON.parse(raw)

  return <CourseClient sections={content.sections} />
}
