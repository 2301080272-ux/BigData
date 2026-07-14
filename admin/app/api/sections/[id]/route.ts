import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const json = await req.json()
  const { title, slug, body, order } = json
  const section = await prisma.section.update({
    where: { id: params.id },
    data: { title, slug, body, order: Number(order) },
    include: { files: true, links: { orderBy: { order: 'asc' } } },
  })
  return NextResponse.json(section)
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.section.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
