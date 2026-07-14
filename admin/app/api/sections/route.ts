import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const sections = await prisma.section.findMany({
    include: { files: true, links: { orderBy: { order: 'asc' } } },
    orderBy: { order: 'asc' },
  })
  return NextResponse.json(sections)
}

export async function POST(req: Request) {
  const json = await req.json()
  const { title, slug, body, order } = json
  const section = await prisma.section.create({
    data: { title, slug, body: body ?? '', order: Number(order ?? 0) },
    include: { files: true, links: { orderBy: { order: 'asc' } } },
  })
  return NextResponse.json(section, { status: 201 })
}
