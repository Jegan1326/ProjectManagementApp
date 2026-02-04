import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from "../context/authcontext"
import { Home, CheckSquare, Trash2, LogOut, User, History } from 'lucide-react'

export default function Sidebar() {
  const { role, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-50 to-indigo-50 border-r border-blue-200 h-screen flex flex-col p-6 shadow-lg">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Dashboard
        </h1>
        <p className="text-sm text-gray-600">Admin Management System</p>
      </div>

      {/* User Info */}
      <div className="bg-white rounded-lg p-4 mb-6 border border-blue-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
            <p className="text-xs text-blue-600 font-medium capitalize">{role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 font-semibold hover:shadow-md transition-all duration-300 transform hover:scale-105"
        >
          <Home size={20} />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/tasks"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-blue-100 transition-all duration-300 transform hover:scale-105"
        >
          <CheckSquare size={20} />
          <span>Tasks</span>
        </Link>

        {(role === "manager" || role === "hr") && (
          <Link
            to="/trash"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-red-100 transition-all duration-300 transform hover:scale-105"
          >
            <Trash2 size={20} />
            <span>Trash</span>
          </Link>
        )}

        <Link
          to="/history"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-purple-100 transition-all duration-300 transform hover:scale-105"
        >
          <History size={20} />
          <span>Records</span>
        </Link>
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-red-100 to-orange-100 text-red-700 font-semibold hover:shadow-md transition-all duration-300 transform hover:scale-105 border border-red-200"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  )
}
