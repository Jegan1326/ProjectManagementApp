import { useState } from 'react'
import { useTask } from '../context/taskcontext'
import Toast, { useToast } from '../components/Toast'
import { Trash2, RotateCcw } from 'lucide-react'

export default function Trash() {
  const { trash, restoreTask, permanentlyDeleteTask } = useTask()
  const { toast, showToast } = useToast()

  const handleRestore = (taskId) => {
    if (window.confirm('Restore this task?')) {
      restoreTask(taskId)
      showToast('Task restored successfully!', 'success')
    }
  }

  const handlePermanentDelete = (taskId) => {
    if (window.confirm('Permanently delete this task? This cannot be undone.')) {
      permanentlyDeleteTask(taskId)
      showToast('Task permanently deleted!', 'success')
    }
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => { }} />}

      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Trash</h1>
        <p className="text-gray-600 mt-1">Manage deleted tasks</p>
      </div>

      {trash.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-12 text-center border border-gray-200">
          <Trash2 className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Trash is Empty</h2>
          <p className="text-gray-600">No deleted tasks to show</p>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-red-50 to-orange-50 border-b-2 border-red-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-red-900">Title</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-red-900">Description</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-red-900">Assigned To</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-red-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {trash.map((task) => (
                <tr key={task._id} className="hover:bg-white transition-colors duration-200">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-900 line-through opacity-75">{task.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 max-w-xs truncate">{task.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-700">{task.assignedTo}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleRestore(task._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-lg hover:shadow-md transform hover:scale-110 transition-all duration-300 font-medium text-sm"
                      >
                        <RotateCcw size={16} />
                        Restore
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(task._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-100 to-orange-100 text-red-700 rounded-lg hover:shadow-md transform hover:scale-110 transition-all duration-300 font-medium text-sm"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
