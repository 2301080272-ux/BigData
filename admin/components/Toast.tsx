'use client'

import { useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'info'

type Props = {
  message: string
  type?: ToastType
  onClose: () => void
}

const styles = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-blue-600',
}

export default function Toast({ message, type = 'info', onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className={['text-white px-6 py-3 rounded shadow-lg', styles[type]].join(' ')}>
        {message}
      </div>
    </div>
  )
}
