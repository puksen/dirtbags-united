import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit({ nickname, email, password }) {
    setLoading(true)
    setError(null)
    try {
      await registerUser(nickname, email || undefined, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-12 p-6">
      <h1 className="text-2xl font-bold text-stone-800 mb-6 text-center">🧗 Registrieren</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Nickname *</label>
          <input
            {...register('nickname', { required: 'Nickname required', minLength: { value: 2, message: 'Min 2 chars' } })}
            className="w-full border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {errors.nickname && <p className="text-red-500 text-sm mt-1">{errors.nickname.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">E-Mail (optional)</label>
          <input
            {...register('email', { validate: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Invalid email' })}
            type="email"
            className="w-full border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Passwort *</label>
          <input
            {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 chars' } })}
            type="password"
            className="w-full border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-stone-300 text-white font-semibold py-2 rounded"
        >
          {loading ? 'Wird registriert...' : 'Registrieren'}
        </button>
      </form>
      <p className="text-center text-sm text-stone-500 mt-4">
        Bereits registriert?{' '}
        <Link to="/login" className="text-amber-600 hover:underline">Einloggen</Link>
      </p>
    </div>
  )
}
