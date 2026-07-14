import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import fs from 'fs/promises'
import path from 'path'
import { execSync } from 'child_process'

export async function POST() {
  try {
    const publicSitePath = process.env.PUBLIC_SITE_PATH || '../public-site'
    const resolvedPublicSite = path.resolve(process.cwd(), publicSitePath)

    const sections = await prisma.section.findMany({
      include: {
        files: true,
        links: { orderBy: { order: 'asc' } },
      },
      orderBy: { order: 'asc' },
    })

    const content = {
      sections,
      publishedAt: new Date().toISOString(),
    }

    const contentJsonPath = path.join(resolvedPublicSite, 'content.json')
    await fs.writeFile(contentJsonPath, JSON.stringify(content, null, 2), 'utf-8')

    const sourceUploads = path.join(process.cwd(), 'public', 'uploads')
    const targetUploads = path.join(resolvedPublicSite, 'public', 'uploads')
    await fs.mkdir(sourceUploads, { recursive: true })
    await fs.mkdir(targetUploads, { recursive: true })

    const sourceFiles = await fs.readdir(sourceUploads).catch(() => [] as string[])
    const targetFiles = await fs.readdir(targetUploads).catch(() => [] as string[])

    for (const file of sourceFiles) {
      if (file === '.gitkeep') continue
      await fs.copyFile(path.join(sourceUploads, file), path.join(targetUploads, file))
    }
    for (const file of targetFiles) {
      if (file === '.gitkeep') continue
      if (!sourceFiles.includes(file)) {
        await fs.unlink(path.join(targetUploads, file))
      }
    }

    const git = `git -C "${resolvedPublicSite}"`
    const branch = execSync(`${git} branch --show-current`, { encoding: 'utf-8' }).trim()

    execSync(`${git} add content.json public/uploads/`)
    try {
      execSync(`${git} commit -m "Publicación automática: ${new Date().toISOString()}"`)
    } catch {
      // puede fallar si no hay cambios; continuamos para hacer push (o no)
    }
    execSync(`${git} push -u origin ${branch}`)

    return NextResponse.json({ ok: true, publishedAt: content.publishedAt })
  } catch (error) {
    console.error(error)
    const message = error instanceof Error ? error.message : 'Error desconocido'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
