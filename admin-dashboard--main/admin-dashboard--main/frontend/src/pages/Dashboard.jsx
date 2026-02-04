import { useState } from 'react'
import { useAuth } from '../context/authcontext'
import { useTask } from '../context/taskcontext'
import Snowfall from 'react-snowfall'
import { TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import Toast, { useToast } from '../components/Toast'

export default function Dashboard() {
  const { role, user } = useAuth()
  const { tasks, completeTask } = useTask()
  const { toast, showToast } = useToast()
  const [selectedTaskId, setSelectedTaskId] = useState(null)

  // Calculate stats dynamically based on actual tasks
  const stats = {
    totalTasks: tasks.filter(t => !t.deleted).length,
    completedTasks: tasks.filter(t => !t.deleted && t.status === 'completed').length,
    inProgressTasks: tasks.filter(t => !t.deleted && t.status === 'in-progress').length,
    todoTasks: tasks.filter(t => !t.deleted && t.status === 'todo').length,
  }

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`bg-gradient-to-br ${color} rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <Icon size={40} className="opacity-20" />
      </div>
    </div>
  )

  return (
    <div className="relative min-h-screen space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => { }} />}
      <Snowfall color="rgba(59, 130, 246, 0.5)" snowflakeCount={50} />

      <div className="relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Welcome, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 text-lg capitalize">Here's your dashboard overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Tasks"
            value={stats.totalTasks}
            icon={TrendingUp}
            color="from-blue-400 to-cyan-500"
          />
          <StatCard
            title="Completed"
            value={stats.completedTasks}
            icon={CheckCircle}
            color="from-green-400 to-emerald-500"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgressTasks}
            icon={Clock}
            color="from-purple-400 to-pink-500"
          />
          <StatCard
            title="To Do"
            value={stats.todoTasks}
            icon={AlertCircle}
            color="from-yellow-400 to-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="lg:col-span-1 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{user?.name}</h3>
                <p className="text-gray-600 capitalize">{role}</p>
              </div>
            </div>
            <div className="space-y-3 border-t border-gray-300 pt-4">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-900">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="font-semibold text-blue-600 capitalize">{role}</p>
              </div>
            </div>
          </div>

          {/* Role Permissions Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Your Permissions</h3>
            <div className="space-y-3">
              {role === 'manager' && (
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-200">
                  <CheckCircle className="text-blue-600 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900">Manager Access</p>
                    <p className="text-sm text-gray-600">Assign tasks to HR and Employees • Add, Edit & Delete Tasks • View Analytics</p>
                  </div>
                </div>
              )}
              {role === 'hr' && (
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-purple-200">
                  <CheckCircle className="text-purple-600 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900">HR Access</p>
                    <p className="text-sm text-gray-600">Assign tasks to Employees • Add, Edit & Delete Tasks • Manage Team</p>
                  </div>
                </div>
              )}
              {role === 'employee' && (
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-green-200">
                  <CheckCircle className="text-green-600 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900">Employee Access</p>
                    <p className="text-sm text-gray-600">View Assigned Tasks • Mark Tasks as Completed • Track Progress</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tasks Panel */}
        <div className="mt-8">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Tasks</h3>
            
            {tasks.filter(t => !t.deleted).length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 text-lg">No tasks yet. Create your first task to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.filter(t => !t.deleted).map((task) => {
                  const isSelected = selectedTaskId === task._id
                  const isCompleted = task.status === 'completed'
                  
                  return (
                    <div
                      key={task._id}
                      onClick={() => setSelectedTaskId(isSelected ? null : task._id)}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-300 transform ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-500 shadow-md scale-102'
                          : 'bg-white border border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                isCompleted
                                  ? 'bg-green-500 border-green-500'
                                  : isSelected
                                  ? 'border-blue-500'
                                  : 'border-gray-300'
                              }`}
                            >
                              {isCompleted && <CheckCircle size={16} className="text-white" />}
                            </div>
                            <div className="flex-1">
                              <p className={`font-semibold ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                {task.title}
                              </p>
                              <p className="text-sm text-gray-600">{task.description}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            task.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : task.status === 'in-progress'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Mark as Completed Button */}
            {selectedTaskId && tasks.find(t => t._id === selectedTaskId)?.status !== 'completed' && (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    const selectedTask = tasks.find(t => t._id === selectedTaskId)
                    if (selectedTask) {
                      completeTask(selectedTaskId)
                      showToast('Task marked as completed! ✅', 'success')
                      setSelectedTaskId(null)
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <CheckCircle className="inline mr-2" size={20} />
                  Mark as Completed
                </button>
                <button
                  onClick={() => setSelectedTaskId(null)}
                  className="px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

