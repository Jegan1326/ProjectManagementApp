import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

export const useToast = () => {
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success', duration = 4000) => {
    setToast({ message, type, id: Date.now() })
    setTimeout(() => setToast(null), duration)
  }

  return { toast, showToast }
}

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800'
  const Icon = type === 'success' ? CheckCircle : AlertCircle

  return (
    <div className={`fixed top-4 right-4 ${bgColor} border ${textColor} px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slideInDown z-50 max-w-sm`}>
      <Icon size={24} />
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-auto hover:opacity-70">
        <X size={20} />
      </button>
    </div>
  )
}
