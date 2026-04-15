import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import api from '../api/index.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function AddCragForm() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { register, handleSubmit, formState: { errors }, setValue } = useForm()

  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const cragMarkerRef = useRef(null)
  const parkingMarkerRef = useRef(null)

  const [mapMode, setMapMode] = useState(null) // 'crag' | 'parking'
  const [cragCoords, setCragCoords] = useState(null)
  const [parkingCoords, setParkingCoords] = useState(null)
  const [photoFiles, setPhotoFiles] = useState([])
  const [photoPreviews, setPhotoPreviews] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    if (!mapContainerRef.current) return
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
      },
      center: [10.0, 47.5],
      zoom: 6,
    })
    mapRef.current = map
    return () => { map.remove(); mapRef.current = null }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapMode) return

    const handler = (e) => {
      const { lng, lat } = e.lngLat
      if (mapMode === 'crag') {
        setCragCoords([lng, lat])
        setValue('cragLng', lng)
        setValue('cragLat', lat)
        if (cragMarkerRef.current) cragMarkerRef.current.remove()
        const el = document.createElement('div')
        el.style.cssText = 'width:18px;height:18px;border-radius:50%;background:#ef4444;border:2px solid white;'
        cragMarkerRef.current = new maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map)
      } else if (mapMode === 'parking') {
        setParkingCoords([lng, lat])
        if (parkingMarkerRef.current) parkingMarkerRef.current.remove()
        const el = document.createElement('div')
        el.style.cssText = 'width:18px;height:18px;border-radius:50%;background:#3b82f6;border:2px solid white;'
        parkingMarkerRef.current = new maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map)
      }
    }

    map.on('click', handler)
    return () => map.off('click', handler)
  }, [mapMode, setValue])

  function handleGPS() {
    if (!navigator.geolocation) return alert('Geolocation not supported')
    navigator.geolocation.getCurrentPosition((pos) => {
      const { longitude, latitude } = pos.coords
      const map = mapRef.current
      if (map) map.flyTo({ center: [longitude, latitude], zoom: 13 })
    })
  }

  function handlePhotoChange(e) {
    const files = Array.from(e.target.files).slice(0, 5)
    setPhotoFiles(files)
    setPhotoPreviews(files.map((f) => URL.createObjectURL(f)))
  }

  async function onSubmit(data) {
    if (!cragCoords) return setSubmitError('Please set crag location on the map')
    if (!user) return navigate('/login')
    setSubmitting(true)
    setSubmitError(null)
    try {
      const payload = {
        name: data.name,
        area: data.area,
        description: data.description,
        exposure: data.exposure,
        approach_time_minutes: data.approach_time_minutes ? parseInt(data.approach_time_minutes) : undefined,
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        location: { type: 'Point', coordinates: cragCoords },
      }
      const { data: crag } = await api.post('/crags', payload)

      if (parkingCoords) {
        await api.post('/parking', {
          crag_id: crag._id,
          location: { type: 'Point', coordinates: parkingCoords },
          description: data.parkingDescription,
        })
      }

      if (photoFiles.length > 0) {
        const form = new FormData()
        photoFiles.forEach((f) => form.append('photos', f))
        await api.post(`/crags/${crag._id}/photos`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }

      navigate(`/crags/${crag._id}`)
    } catch (err) {
      setSubmitError(err.response?.data?.error || err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-stone-800">Neuen Fels hinzufügen</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Name *</label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="w-full border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Gebiet (Area)</label>
          <input
            {...register('area')}
            className="w-full border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Beschreibung</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Exposition</label>
            <input
              {...register('exposure')}
              placeholder="z.B. Süd, SW"
              className="w-full border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Zustieg (min)</label>
            <input
              {...register('approach_time_minutes')}
              type="number"
              min="0"
              className="w-full border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Tags (kommagetrennt)</label>
          <input
            {...register('tags')}
            placeholder="sport, trad, bouldern"
            className="w-full border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Position auf Karte setzen</label>
          <div className="flex gap-2 mb-2 flex-wrap">
            <button
              type="button"
              onClick={() => setMapMode('crag')}
              className={`px-3 py-1.5 rounded text-sm font-medium ${mapMode === 'crag' ? 'bg-red-500 text-white' : 'bg-stone-200 text-stone-700 hover:bg-stone-300'}`}
            >
              🪨 Fels positionieren {cragCoords && '✓'}
            </button>
            <button
              type="button"
              onClick={() => setMapMode('parking')}
              className={`px-3 py-1.5 rounded text-sm font-medium ${mapMode === 'parking' ? 'bg-blue-500 text-white' : 'bg-stone-200 text-stone-700 hover:bg-stone-300'}`}
            >
              🅿️ Parkplatz setzen {parkingCoords && '✓'}
            </button>
            <button
              type="button"
              onClick={handleGPS}
              className="px-3 py-1.5 rounded text-sm font-medium bg-stone-200 text-stone-700 hover:bg-stone-300"
            >
              📍 Mein Standort
            </button>
          </div>
          {mapMode && (
            <p className="text-xs text-stone-500 mb-1">
              {mapMode === 'crag' ? 'Klick auf Karte → Fels-Position setzen' : 'Klick auf Karte → Parkplatz setzen'}
            </p>
          )}
          <div ref={mapContainerRef} style={{ height: '300px', width: '100%' }} className="rounded border border-stone-300" />
        </div>

        {parkingCoords && (
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Parkplatz-Beschreibung</label>
            <input
              {...register('parkingDescription')}
              className="w-full border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Fotos (max. 5, je 5 MB)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoChange}
            className="w-full text-sm text-stone-600"
          />
          {photoPreviews.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {photoPreviews.map((src, i) => (
                <img key={i} src={src} alt="" className="h-20 w-20 object-cover rounded" />
              ))}
            </div>
          )}
        </div>

        {submitError && (
          <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{submitError}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-stone-300 text-white font-semibold py-2 rounded"
        >
          {submitting ? 'Wird gespeichert...' : 'Fels hinzufügen'}
        </button>
      </form>
    </div>
  )
}
