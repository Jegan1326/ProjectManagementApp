import { Edit2, Trash2, Send, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function TaskTable({ tasks, onEdit, onDelete, onAssign, onComplete }) {
  const { role } = useAuth()

  const canManageTask = (task) => {
    return role === 'manager' || role === 'hr'
  }

  const canCompleteTask = (task) => {
    return role === 'employee' && task.assignedTo === 'You'
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-bold text-blue-900">Title</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-blue-900">Description</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-blue-900">Status</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-blue-900">Assigned To</th>
            <th className="px-6 py-4 text-center text-sm font-bold text-blue-900">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium">
                No tasks found
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task._id} className="hover:bg-white transition-colors duration-200">
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-gray-900">{task.title}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600 max-w-xs truncate">{task.description || '—'}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    task.status === 'completed'
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : task.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                  }`}>
                    {task.status === 'in-progress' ? 'In Progress' : task.status === 'todo' ? 'To Do' : 'Completed'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-700">{task.assignedTo}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    {canManageTask(task) && (
                      <>
                        <button
                          onClick={() => onAssign?.(task)}
                          className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-lg hover:shadow-md transform hover:scale-110 transition-all duration-300"
                          title="Assign task"
                        >
                          <Send size={18} />
                        </button>
                        <button
                          onClick={() => onEdit?.(task)}
                          className="p-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-lg hover:shadow-md transform hover:scale-110 transition-all duration-300"
                          title="Edit task"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => onDelete?.(task._id)}
                          className="p-2 bg-gradient-to-r from-red-100 to-orange-100 text-red-700 rounded-lg hover:shadow-md transform hover:scale-110 transition-all duration-300"
                          title="Delete task"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                    {canCompleteTask(task) && task.status !== 'completed' && (
                      <button
                        onClick={() => onComplete?.(task._id)}
                        className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-lg hover:shadow-md transform hover:scale-110 transition-all duration-300"
                        title="Mark as completed"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
