import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const json = await req.json()
  const { title, url, order, sectionId } = json

  if (!title || !url || !sectionId) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  }

  const link = await prisma.link.create({
    data: {
      title,
      url,
      order: Number(order ?? 0),
      sectionId,
    },
  })

  return NextResponse.json(link, { status: 201 })
}
