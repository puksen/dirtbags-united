import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/index.js'
import Map from '../components/Map.jsx'

export default function CragDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [crag, setCrag] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [gradeFilter, setGradeFilter] = useState('')
  const [styleFilter, setStyleFilter] = useState('')

  useEffect(() => {
    api.get(`/crags/${id}`)
      .then(({ data }) => setCrag(data))
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center items-center h-48 text-stone-500">Loading…</div>
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>
  if (!crag) return null

  const [lng, lat] = crag.location?.coordinates || []
  const markers = [
    ...(lng != null ? [{ lng, lat, type: 'crag', label: crag.name }] : []),
    ...(crag.parking || []).map((p) => ({
      lng: p.location?.coordinates?.[0],
      lat: p.location?.coordinates?.[1],
      type: 'parking',
      label: p.description || 'Parking',
    })),
  ]

  const grades = [...new Set(crag.routes?.map((r) => r.topo_grade).filter(Boolean))]
  const styles = [...new Set(crag.routes?.flatMap((r) => r.style_tags || []))]

  const filteredRoutes = (crag.routes || []).filter((r) => {
    const matchGrade = !gradeFilter || r.topo_grade === gradeFilter
    const matchStyle = !styleFilter || (r.style_tags || []).includes(styleFilter)
    return matchGrade && matchStyle
  })

  return (
    <div className="max-w-3xl mx-auto">
      {crag.photos?.[0] ? (
        <img
          src={`http://localhost:3001${crag.photos[0]}`}
          alt={crag.name}
          className="w-full h-56 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-stone-700 via-stone-600 to-amber-700 flex items-end p-6">
          <span className="text-white text-4xl font-bold drop-shadow">{crag.name}</span>
        </div>
      )}

      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">{crag.name}</h1>
          {crag.area && <p className="text-stone-500">{crag.area}</p>}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <InfoCard label="Routen" value={crag.routes?.length ?? 0} />
          <InfoCard label="Zustieg" value={crag.approach_time_minutes ? `${crag.approach_time_minutes} min` : '—'} />
          <InfoCard label="Exposition" value={crag.exposure || '—'} />
          <InfoCard
            label="Grade-Range"
            value={
              crag.routes?.length
                ? `${grades.sort()[0] || '?'}–${grades.sort().slice(-1)[0] || '?'}`
                : '—'
            }
          />
        </div>

        {crag.description && <p className="text-stone-700 leading-relaxed">{crag.description}</p>}

        {crag.tags?.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {crag.tags.map((t) => (
              <span key={t} className="bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full text-xs">{t}</span>
            ))}
          </div>
        )}

        {markers.length > 0 && (
          <div className="rounded overflow-hidden border border-stone-200">
            <Map markers={markers} height="220px" />
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold text-stone-800 mb-2">Routen ({crag.routes?.length ?? 0})</h2>

          <div className="flex gap-2 mb-3 flex-wrap">
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="border border-stone-300 rounded px-2 py-1 text-sm"
            >
              <option value="">Alle Grade</option>
              {grades.sort().map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            <select
              value={styleFilter}
              onChange={(e) => setStyleFilter(e.target.value)}
              className="border border-stone-300 rounded px-2 py-1 text-sm"
            >
              <option value="">Alle Stile</option>
              {styles.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            {filteredRoutes.length === 0 && (
              <p className="text-stone-400 text-sm">Keine Routen gefunden.</p>
            )}
            {filteredRoutes.map((route) => (
              <Link
                key={route._id}
                to={`/routes/${route._id}`}
                className="flex items-center justify-between p-3 bg-white border border-stone-200 rounded-lg hover:border-amber-400 transition-colors"
              >
                <div>
                  <span className="font-medium text-stone-800">{route.name}</span>
                  {route.style_tags?.length > 0 && (
                    <div className="flex gap-1 mt-0.5">
                      {route.style_tags.map((t) => (
                        <span key={t} className="text-xs bg-amber-100 text-amber-700 px-1.5 rounded">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-bold text-stone-700">{route.topo_grade || '?'}</span>
                  {route.height_m && <p className="text-xs text-stone-400">{route.height_m}m</p>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ label, value }) {
  return (
    <div className="bg-stone-50 rounded-lg p-3 text-center border border-stone-200">
      <p className="text-xs text-stone-500 uppercase tracking-wide">{label}</p>
      <p className="font-semibold text-stone-800 mt-0.5">{value}</p>
    </div>
  )
}
