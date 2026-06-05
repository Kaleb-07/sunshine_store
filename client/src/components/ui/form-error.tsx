import { AlertCircle } from 'lucide-react'

interface FormErrorProps {
  message?: string | null
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null

  return (
    <div className="flex items-center gap-1.5 text-destructive text-xs mt-1">
      <AlertCircle className="w-3 h-3" />
      <span>{message}</span>
    </div>
  )
}
