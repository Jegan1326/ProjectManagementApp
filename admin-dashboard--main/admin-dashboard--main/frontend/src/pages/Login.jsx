import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authcontext'
import { useToast } from '../components/Toast'
import Toast from '../components/Toast'
import { Mail, Lock, LogIn } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('employee')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const { toast, showToast } = useToast()

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      showToast('Please fill in all fields', 'error')
      return
    }

    if (!email.includes('@')) {
      showToast('Please enter a valid email', 'error')
      return
    }

    setLoading(true)

    try {
      // Simulate API call - In production, call actual backend
      await new Promise(resolve => setTimeout(resolve, 1500))

      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        role,
      }

      const token = 'dummy_token_' + Date.now()
      login(userData, role, token)
      showToast(`Welcome back, ${userData.name}!`, 'success')

      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (error) {
      showToast('Login failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickLogin = (selectedRole) => {
    const demoAccounts = {
      manager: 'manager@example.com',
      hr: 'hr@example.com',
      employee: 'employee@example.com',
    }
    setEmail(demoAccounts[selectedRole])
    setPassword('demo123')
    setRole(selectedRole)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => { }} />}

      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-3">
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 text-center mb-8">Sign in to your account</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
                <option value="manager">Manager</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <p className="text-center text-sm text-gray-600 mb-4">Quick demo login:</p>
            <div className="grid grid-cols-3 gap-2">
              {['manager', 'hr', 'employee'].map((r) => (
                <button
                  key={r}
                  onClick={() => handleQuickLogin(r)}
                  className="px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-100 transition-all duration-300 capitalize"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-blue-600 font-semibold hover:text-indigo-600 transition"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
