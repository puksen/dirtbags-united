import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit({ nickname, password }) {
    setLoading(true)
    setError(null)
    try {
      await login(nickname, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-12 p-6">
      <h1 className="text-2xl font-bold text-stone-800 mb-6 text-center">🧗 Einloggen</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Nickname</label>
          <input
            {...register('nickname', { required: 'Nickname required' })}
            className="w-full border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {errors.nickname && <p className="text-red-500 text-sm mt-1">{errors.nickname.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Passwort</label>
          <input
            {...register('password', { required: 'Password required' })}
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
          {loading ? 'Einloggen...' : 'Einloggen'}
        </button>
      </form>
      <p className="text-center text-sm text-stone-500 mt-4">
        Noch kein Konto?{' '}
        <Link to="/register" className="text-amber-600 hover:underline">Registrieren</Link>
      </p>
    </div>
  )
}
