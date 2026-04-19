import Button from './components/Button'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'

function MapPage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold text-stone-800">Map</h1>
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          className="rounded-full bg-sky-400 px-5 py-3 font-medium text-slate-950 transition hover:bg-sky-300"
          href="https://tailwindcss.com/docs"
          target="_blank"
          rel="noreferrer"
        >
          Tailwind Docs
        </a>
        <a
          className="rounded-full border border-black/15 px-5 py-3 font-medium text-black transition hover:border-white/30 hover:bg-white/5"
          href="https://vite.dev/guide/"
          target="_blank"
          rel="noreferrer"
        >
          Vite Guide
        </a>
      </div>
      <div className="mt-8 flex justify-center gap-3">
        <Button label="test secondary" variant="secondary" />
        <Button label="test primary" variant="primary" />
      </div>
    </section>
  )
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
      </Routes>
      <Navbar />
    </main>
  )
}

export default App
