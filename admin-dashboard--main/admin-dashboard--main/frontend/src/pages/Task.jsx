import { useState } from 'react'
import { useAuth } from '../context/authcontext'
import { useTask } from '../context/taskcontext'
import TaskTable from '../components/TaskTabel'
import TaskModal from '../components/TaskModal'
import AssignTaskModal from '../components/AssignTaskModal'
import Toast, { useToast } from '../components/Toast'
import { Plus, RefreshCw } from 'lucide-react'

export default function Task() {
  const { role } = useAuth()
  const { tasks, addTask, editTask, deleteTask, completeTask, assignTask } = useTask()
  const { toast, showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false)
  const [isAssignTaskOpen, setIsAssignTaskOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  const canManage = role === 'manager' || role === 'hr'

  const filteredTasks = filterStatus === 'all'
    ? tasks.filter(t => !t.deleted)
    : tasks.filter(t => !t.deleted && t.status === filterStatus)

  const handleAddTask = (formData) => {
    addTask(formData)
    showToast('Task added successfully!', 'success')
  }

  const handleEditTask = (taskId, formData) => {
    editTask(taskId, formData)
    showToast('Task updated successfully!', 'success')
  }

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId)
      showToast('Task moved to trash!', 'success')
    }
  }

  const handleAssignTask = (newAssignee) => {
    if (selectedTask) {
      assignTask(selectedTask._id, newAssignee)
      showToast('Task assigned successfully!', 'success')
      setIsAssignTaskOpen(false)
    }
  }

  const handleCompleteTask = (taskId) => {
    completeTask(taskId)
    showToast('Task marked as completed!', 'success')
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => { }} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Tasks</h1>
          <p className="text-gray-600 mt-1">Manage your team's workload</p>
        </div>
        {canManage && (
          <button
            onClick={() => setIsAddTaskOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <Plus size={20} />
            Add Task
          </button>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {['all', 'todo', 'in-progress', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              filterStatus === status
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="animate-spin text-blue-600" size={40} />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-dashed border-blue-300">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-700 mb-2">No tasks yet</p>
            <p className="text-gray-600 mb-6">
              {filterStatus === 'all' 
                ? 'Create your first task to get started' 
                : `No ${filterStatus === 'in-progress' ? 'in-progress' : filterStatus} tasks found`}
            </p>
            {canManage && filterStatus === 'all' && (
              <button
                onClick={() => setIsAddTaskOpen(true)}
                className="flex items-center gap-2 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Plus size={20} />
                Create First Task
              </button>
            )}
          </div>
        </div>
      ) : (
        <TaskTable
          tasks={filteredTasks}
          onEdit={(task) => {
            setSelectedTask(task)
            setIsEditTaskOpen(true)
          }}
          onDelete={handleDeleteTask}
          onAssign={(task) => {
            setSelectedTask(task)
            setIsAssignTaskOpen(true)
          }}
          onComplete={handleCompleteTask}
        />
      )}

      {/* Modals */}
      <TaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onSubmit={handleAddTask}
        type="add"
      />

      <TaskModal
        isOpen={isEditTaskOpen}
        onClose={() => {
          setIsEditTaskOpen(false)
          setSelectedTask(null)
        }}
        onSubmit={(formData) => handleEditTask(selectedTask._id, formData)}
        task={selectedTask}
        type="edit"
      />

      <AssignTaskModal
        isOpen={isAssignTaskOpen}
        onClose={() => {
          setIsAssignTaskOpen(false)
          setSelectedTask(null)
        }}
        onSubmit={handleAssignTask}
        task={selectedTask}
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
          <p className="text-sm text-gray-600 font-medium">To Do Tasks</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {filteredTasks.filter(t => t.status === 'todo').length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <p className="text-sm text-gray-600 font-medium">In Progress</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {filteredTasks.filter(t => t.status === 'in-progress').length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <p className="text-sm text-gray-600 font-medium">Completed</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {filteredTasks.filter(t => t.status === 'completed').length}
          </p>
        </div>
      </div>
    </div>
  )
}
