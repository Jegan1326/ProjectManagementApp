import { useState } from 'react'
import { useHistory } from '../context/historycontext'
import { Clock, Users, Trash2, Filter } from 'lucide-react'

export default function History() {
  const { taskHistory, userHistory, clearTaskHistory, clearUserHistory } = useHistory()
  const [activeTab, setActiveTab] = useState('tasks')
  const [filterAction, setFilterAction] = useState('all')

  const getTaskHistoryData = () => {
    if (filterAction === 'all') return taskHistory
    return taskHistory.filter(h => h.action === filterAction)
  }

  const getUserHistoryData = () => {
    if (filterAction === 'all') return userHistory
    return userHistory.filter(h => h.action === filterAction)
  }

  const taskActions = ['all', 'Created', 'Updated', 'Assigned', 'Completed', 'Deleted', 'Restored', 'Permanently Deleted']
  const userActions = ['all', 'Login', 'Logout']

  const getActionColor = (action) => {
    switch (action) {
      case 'Created':
        return 'bg-green-100 text-green-700'
      case 'Updated':
        return 'bg-blue-100 text-blue-700'
      case 'Assigned':
        return 'bg-purple-100 text-purple-700'
      case 'Completed':
        return 'bg-emerald-100 text-emerald-700'
      case 'Deleted':
        return 'bg-orange-100 text-orange-700'
      case 'Restored':
        return 'bg-yellow-100 text-yellow-700'
      case 'Permanently Deleted':
        return 'bg-red-100 text-red-700'
      case 'Login':
        return 'bg-green-100 text-green-700'
      case 'Logout':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const handleClearHistory = (type) => {
    if (type === 'tasks') {
      if (window.confirm('Are you sure you want to clear all task history? This cannot be undone.')) {
        clearTaskHistory()
      }
    } else {
      if (window.confirm('Are you sure you want to clear all user history? This cannot be undone.')) {
        clearUserHistory()
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Records & History
        </h1>
        <p className="text-gray-600 mt-1">Track all task and user activities</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4">
        <button
          onClick={() => { setActiveTab('tasks'); setFilterAction('all'); }}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'tasks'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Clock size={20} />
          Task History
        </button>
        <button
          onClick={() => { setActiveTab('users'); setFilterAction('all'); }}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Users size={20} />
          User Activity
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {(activeTab === 'tasks' ? taskActions : userActions).map((action) => (
          <button
            key={action}
            onClick={() => setFilterAction(action)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              filterAction === action
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {action.charAt(0).toUpperCase() + action.slice(1)}
          </button>
        ))}
      </div>

      {/* Task History */}
      {activeTab === 'tasks' && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
            <h2 className="text-xl font-bold text-gray-900">Task Records ({getTaskHistoryData().length})</h2>
            {taskHistory.length > 0 && (
              <button
                onClick={() => handleClearHistory('tasks')}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-semibold transition-all duration-300"
              >
                <Trash2 size={18} />
                Clear History
              </button>
            )}
          </div>

          {getTaskHistoryData().length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 text-lg">No task history records found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {getTaskHistoryData().map((record) => (
                <div key={record.id} className="p-6 hover:bg-white transition-colors duration-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getActionColor(record.action)}`}>
                          {record.action}
                        </span>
                        <p className="text-lg font-semibold text-gray-900">{record.taskTitle}</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{record.details}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-xs text-gray-500 mt-3">
                    <span>By: <strong>{record.userName}</strong></span>
                    <span>📅 {record.date}</span>
                    <span>🕐 {record.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* User History */}
      {activeTab === 'users' && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200">
            <h2 className="text-xl font-bold text-gray-900">User Activity ({getUserHistoryData().length})</h2>
            {userHistory.length > 0 && (
              <button
                onClick={() => handleClearHistory('users')}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-semibold transition-all duration-300"
              >
                <Trash2 size={18} />
                Clear History
              </button>
            )}
          </div>

          {getUserHistoryData().length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 text-lg">No user activity records found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {getUserHistoryData().map((record) => (
                <div key={record.id} className="p-6 hover:bg-white transition-colors duration-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getActionColor(record.action)}`}>
                          {record.action}
                        </span>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">{record.userName}</p>
                          <p className="text-sm text-gray-600">Role: <strong className="capitalize">{record.userRole}</strong></p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{record.details}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-xs text-gray-500 mt-3">
                    <span>📅 {record.date}</span>
                    <span>🕐 {record.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 border border-blue-200">
          <p className="text-sm text-gray-600 font-medium">Total Task Records</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{taskHistory.length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg p-6 border border-purple-200">
          <p className="text-sm text-gray-600 font-medium">Total User Records</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">{userHistory.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6 border border-green-200">
          <p className="text-sm text-gray-600 font-medium">Total Activities</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{taskHistory.length + userHistory.length}</p>
        </div>
      </div>
    </div>
  )
}
