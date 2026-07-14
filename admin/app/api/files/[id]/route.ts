import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import fs from 'fs/promises'
import path from 'path'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const file = await prisma.file.delete({ where: { id: params.id } })
    const filePath = path.join(process.cwd(), 'public', 'uploads', file.filename)
    await fs.unlink(filePath).catch(() => {})
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    const message = error instanceof Error ? error.message : 'Error desconocido'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
