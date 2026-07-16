'use client'

import { useState } from 'react'

type Props = {
  src: string
  alt: string
  className?: string
  fallback: string
}

export default function Avatar({ src, alt, className = '', fallback }: Props) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-white/20 text-white font-bold overflow-hidden`}
        aria-label={alt}
      >
        {fallback}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  )
}
