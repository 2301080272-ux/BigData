import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const json = await req.json()
  const { title, url, order } = json
  const link = await prisma.link.update({
    where: { id: params.id },
    data: { title, url, order: Number(order) },
  })
  return NextResponse.json(link)
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.link.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
