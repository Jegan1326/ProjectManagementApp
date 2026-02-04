import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authcontext'
import { useToast } from '../components/Toast'
import Toast from '../components/Toast'
import { Mail, Lock, User, UserCheck } from 'lucide-react'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('employee')
  const [verificationCode, setVerificationCode] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const { toast, showToast } = useToast()

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      showToast('Please fill in all fields', 'error')
      return false
    }
    if (!email.includes('@')) {
      showToast('Please enter a valid email', 'error')
      return false
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error')
      return false
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error')
      return false
    }
    return true
  }

  const handleSendVerification = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      // Simulate sending verification email
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsEmailSent(true)
      showToast('Verification code sent to your email!', 'success')
    } catch (error) {
      showToast('Failed to send verification code', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyAndSignUp = async (e) => {
    e.preventDefault()
    
    if (!verificationCode) {
      showToast('Please enter the verification code', 'error')
      return
    }

    // Simulate verification
    if (verificationCode !== '123456') {
      showToast('Invalid verification code', 'error')
      return
    }

    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))

      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        role,
      }

      const token = 'dummy_token_' + Date.now()
      login(userData, role, token)
      showToast(`Welcome, ${name}! Your account has been created.`, 'success')

      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (error) {
      showToast('Sign up failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => { }} />}

      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-3">
              <UserCheck className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Create Account</h1>
          <p className="text-gray-600 text-center mb-8">Join our admin dashboard</p>

          <form onSubmit={isEmailSent ? handleVerifyAndSignUp : handleSendVerification} className="space-y-4">
            {!isEmailSent ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
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
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  >
                    <option value="employee">Employee</option>
                    <option value="hr">HR</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Sending code...' : 'Send Verification Code'}
                </button>
              </>
            ) : (
              <>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-800 text-sm font-medium">
                    Verification code sent to <strong>{email}</strong>
                  </p>
                  <p className="text-green-700 text-xs mt-2">Demo code: 123456</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="000000"
                    maxLength="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-center text-2xl tracking-widest"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Creating account...' : 'Verify & Create Account'}
                </button>

                <button
                  type="button"
                  onClick={() => setIsEmailSent(false)}
                  className="w-full text-gray-600 font-medium py-2 hover:text-gray-900 transition"
                >
                  Back
                </button>
              </>
            )}
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-green-600 font-semibold hover:text-emerald-600 transition"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
