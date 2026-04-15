import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/index.js'
import { useAuth } from '../contexts/AuthContext.jsx'

const TICK_STYLES = ['onsight', 'flash', 'rotpunkt', 'toprope']
const RATINGS = ['😐', '🙂', '😊', '😁', '🤩']

export default function RouteDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [route, setRoute] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showBeta, setShowBeta] = useState(false)
  const [showTickModal, setShowTickModal] = useState(false)
  const [tick, setTick] = useState({ style: '', grade_felt: '', rating: 0, beta: '' })
  const [tickError, setTickError] = useState(null)
  const [tickSuccess, setTickSuccess] = useState(false)

  useEffect(() => {
    api.get(`/routes/${id}`)
      .then(({ data }) => setRoute(data))
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setLoading(false))
  }, [id])

  async function submitTick() {
    if (!tick.style) return setTickError('Bitte Stil auswählen')
    setTickError(null)
    try {
      await api.post('/ticks', { route_id: id, ...tick, rating: tick.rating || undefined })
      setTickSuccess(true)
      setTimeout(() => { setShowTickModal(false); setTickSuccess(false) }, 1500)
    } catch (err) {
      setTickError(err.response?.data?.error || err.message)
    }
  }

  if (loading) return <div className="flex justify-center items-center h-48 text-stone-500">Loading…</div>
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>
  if (!route) return null

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-5">
      <div>
        {route.crag && (
          <Link to={`/crags/${route.crag._id}`} className="text-sm text-amber-600 hover:underline">
            ← {route.crag.name}{route.crag.area ? ` / ${route.crag.area}` : ''}
          </Link>
        )}
        <h1 className="text-2xl font-bold text-stone-800 mt-1">{route.name}</h1>
        {route.sector && <p className="text-stone-500 text-sm">Sektor: {route.sector.name}</p>}
      </div>

      {route.topo_image ? (
        <img src={`http://localhost:3001${route.topo_image}`} alt="Topo" className="w-full rounded-lg" />
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-stone-200 to-stone-300 rounded-lg flex items-center justify-center text-stone-400 text-lg">
          🧗 Topo nicht vorhanden
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <MetaCard label="Grad" value={route.topo_grade || '?'} highlight />
        <MetaCard label="Community" value={route.community_grade_min ? `${route.community_grade_min}–${route.community_grade_max || route.community_grade_min}` : '—'} />
        <MetaCard label="Höhe" value={route.height_m ? `${route.height_m}m` : '—'} />
      </div>

      {route.style_tags?.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {route.style_tags.map((t) => (
            <span key={t} className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-sm">{t}</span>
          ))}
        </div>
      )}

      {route.safety_info && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
          ⚠️ {route.safety_info}
        </div>
      )}

      <div className="border border-stone-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setShowBeta(!showBeta)}
          className="w-full flex items-center justify-between px-4 py-3 bg-stone-50 text-stone-700 font-medium"
        >
          <span>💡 Beta-Notizen ({route.betaNotes?.length ?? 0})</span>
          <span>{showBeta ? '▲' : '▼'}</span>
        </button>
        {showBeta && (
          <div className="divide-y divide-stone-100">
            {route.betaNotes?.length === 0 && (
              <p className="px-4 py-3 text-stone-400 text-sm">Keine Beta-Notizen vorhanden.</p>
            )}
            {route.betaNotes?.map((note) => (
              <div key={note._id} className="px-4 py-3">
                <p className="text-stone-700 text-sm">{note.body}</p>
                <p className="text-xs text-stone-400 mt-1">— {note.author_id?.nickname || 'Anonym'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {user ? (
        <button
          onClick={() => setShowTickModal(true)}
          className="w-full bg-amber-500 hover:bg-amber-400 text-white font-semibold py-3 rounded-lg text-lg"
        >
          ✓ Tick eintragen
        </button>
      ) : (
        <Link to="/login" className="block w-full text-center bg-stone-200 text-stone-700 font-medium py-3 rounded-lg">
          Einloggen zum Ticken
        </Link>
      )}

      {showTickModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold text-stone-800">Tick eintragen – {route.name}</h2>

            <div>
              <p className="text-sm font-medium text-stone-600 mb-2">Stil</p>
              <div className="flex gap-2 flex-wrap">
                {TICK_STYLES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setTick({ ...tick, style: s })}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${tick.style === s ? 'bg-amber-500 border-amber-500 text-white' : 'border-stone-300 text-stone-700 hover:border-amber-400'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-stone-600 block mb-1">Gefühlter Grad</label>
              <input
                value={tick.grade_felt}
                onChange={(e) => setTick({ ...tick, grade_felt: e.target.value })}
                placeholder="z.B. 7a"
                className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-stone-600 mb-2">Bewertung</p>
              <div className="flex gap-3 text-2xl">
                {RATINGS.map((emoji, i) => (
                  <button
                    key={i}
                    onClick={() => setTick({ ...tick, rating: i + 1 })}
                    className={`transition-transform ${tick.rating === i + 1 ? 'scale-125' : 'opacity-50 hover:opacity-75'}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-stone-600 block mb-1">Beta / Notiz</label>
              <textarea
                value={tick.beta}
                onChange={(e) => setTick({ ...tick, beta: e.target.value })}
                rows={2}
                className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {tickError && <p className="text-red-500 text-sm">{tickError}</p>}
            {tickSuccess && <p className="text-green-600 text-sm font-medium">✓ Tick gespeichert!</p>}

            <div className="flex gap-3">
              <button
                onClick={() => setShowTickModal(false)}
                className="flex-1 border border-stone-300 text-stone-700 py-2 rounded-lg"
              >
                Abbrechen
              </button>
              <button
                onClick={submitTick}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-white font-semibold py-2 rounded-lg"
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MetaCard({ label, value, highlight }) {
  return (
    <div className={`rounded-lg p-3 text-center border ${highlight ? 'border-amber-300 bg-amber-50' : 'border-stone-200 bg-stone-50'}`}>
      <p className="text-xs text-stone-500 uppercase tracking-wide">{label}</p>
      <p className={`font-bold mt-0.5 ${highlight ? 'text-amber-700 text-xl' : 'text-stone-800'}`}>{value}</p>
    </div>
  )
}
