import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/')
    const filePath = join(process.cwd(), 'public', 'uploads', path)
    
    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }
    
    // Get file stats
    const fileStats = await stat(filePath)
    
    // Read file
    const fileBuffer = await readFile(filePath)
    
    // Determine content type
    const ext = path.split('.').pop()?.toLowerCase()
    let contentType = 'application/octet-stream'
    
    switch (ext) {
      case 'pdf':
        contentType = 'application/pdf'
        break
      case 'doc':
      case 'docx':
        contentType = 'application/msword'
        break
      case 'xls':
      case 'xlsx':
        contentType = 'application/vnd.ms-excel'
        break
      case 'ppt':
      case 'pptx':
        contentType = 'application/vnd.ms-powerpoint'
        break
      case 'png':
        contentType = 'image/png'
        break
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg'
        break
      case 'gif':
        contentType = 'image/gif'
        break
      default:
        contentType = 'application/octet-stream'
    }
    
    // Return file with proper headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileStats.size.toString(),
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        'Content-Disposition': `inline; filename="${encodeURIComponent(path.split('/').pop() || 'file')}"`
      }
    })
  } catch (error) {
    console.error('Error serving file:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
