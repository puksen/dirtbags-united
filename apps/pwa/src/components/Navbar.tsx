import { MapIcon, BookOpenIcon, HeartIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { NavLink } from 'react-router-dom'
 
const navigation = [
  { name: 'Map', to: '/', icon: MapIcon },
  { name: 'Logbook', to: '/logbook', icon: BookOpenIcon },
  { name: 'Favorites', to: '/favorites', icon: HeartIcon },
  { name: 'Profile', to: '/profile', icon: UserCircleIcon },
]

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-stone-200 bg-stone-50 px-2 py-2 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
      <div className="mx-auto flex max-w-3xl items-center justify-around">
        {navigation.map((item) => (
          <NavLink
            className={({ isActive }) =>
              `flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-full px-3 py-2 transition-colors ${
                isActive ? 'bg-orange-100 text-orange-700' : 'text-stone-600 hover:bg-stone-100'
              }`
            }
            key={item.name}
            to={item.to}
            end={item.to === '/'}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`h-6 w-6 ${isActive ? 'text-orange-700' : 'text-stone-600'}`} />
                <span className={`text-xs ${isActive ? 'text-orange-700' : 'text-stone-600'}`}>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}