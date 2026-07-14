import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
}

const variants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white',
}

export default function Button({ children, variant = 'primary', type = 'button', disabled, onClick }: Props) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        'px-4 py-2 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
      ].join(' ')}
    >
      {children}
    </button>
  )
}
