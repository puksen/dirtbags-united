import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-stone-800 text-white px-4 py-3 flex items-center justify-between shadow-md">
      <Link to="/" className="text-xl font-bold tracking-wide text-amber-400">
        🧗 Dirtbags United
      </Link>
      <div className="flex items-center gap-4 text-sm">
        {user ? (
          <>
            <span className="text-stone-300">{user.nickname}</span>
            <button
              onClick={logout}
              className="bg-stone-600 hover:bg-stone-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-amber-400">Login</Link>
            <Link
              to="/register"
              className="bg-amber-500 hover:bg-amber-400 text-stone-900 px-3 py-1 rounded font-semibold"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
