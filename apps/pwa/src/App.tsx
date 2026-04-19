import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import StylePage from './pages/StylePage'

function MapPage() {
  return <h1 className="text-2xl font-semibold text-stone-800">Map</h1>
}

function LogbookPage() {
  return <h1 className="text-2xl font-semibold text-stone-800">Logbook</h1>
}

function FavoritesPage() {
  return <h1 className="text-2xl font-semibold text-stone-800">Favorites</h1>
}

function ProfilePage() {
  return <h1 className="text-2xl font-semibold text-stone-800">Profile</h1>
}

function App() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-6 pb-24">
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/logbook" element={<LogbookPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/styleguide" element={<StylePage />} />
      </Routes>
      <Navbar />
    </main>
  )
}

export default App
