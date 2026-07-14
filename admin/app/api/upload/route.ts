import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/prisma'

const uploadDir = path.join(process.cwd(), 'public', 'uploads')

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const sectionId = formData.get('sectionId') as string

  if (!file || !sectionId) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`
  const filePath = path.join(uploadDir, safeName)

  await writeFile(filePath, buffer)

  const saved = await prisma.file.create({
    data: {
      filename: safeName,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      sectionId,
    },
  })

  return NextResponse.json(saved, { status: 201 })
}
