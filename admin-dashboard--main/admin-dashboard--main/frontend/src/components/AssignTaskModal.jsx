import { useState } from 'react'
import { X, Send } from 'lucide-react'

export default function AssignTaskModal({ isOpen, onClose, onSubmit, task }) {
  const [assignTo, setAssignTo] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!assignTo) {
      alert('Please select an employee')
      return
    }
    onSubmit(assignTo)
    setAssignTo('')
    onClose()
  }

  if (!isOpen) return null

  const employees = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams']

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-scaleIn">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Assign Task</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700">
              <strong>Task:</strong> {task?.title}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Employee</label>
            <div className="space-y-2">
              {employees.map((emp) => (
                <label key={emp} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                  <input
                    type="radio"
                    value={emp}
                    checked={assignTo === emp}
                    onChange={(e) => setAssignTo(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-3 text-gray-700 font-medium">{emp}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Send size={20} className="inline mr-2" />
              Assign
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
