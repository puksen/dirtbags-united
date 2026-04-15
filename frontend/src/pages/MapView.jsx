import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import api from '../api/index.js'

export default function MapView() {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!containerRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
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

    map.on('load', async () => {
      try {
        const { data: crags } = await api.get('/crags')
        crags.forEach((crag) => {
          if (!crag.location?.coordinates) return
          const [lng, lat] = crag.location.coordinates

          const el = document.createElement('div')
          el.style.cssText =
            'width:18px;height:18px;border-radius:50%;background:#ef4444;border:2px solid white;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.4);'
          el.title = crag.name

          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([lng, lat])
            .setPopup(
              new maplibregl.Popup({ offset: 12 }).setHTML(
                `<strong>${crag.name}</strong>${crag.area ? `<br/><span style="color:#666">${crag.area}</span>` : ''}`
              )
            )
            .addTo(map)

          el.addEventListener('click', (e) => {
            e.stopPropagation()
            navigate(`/crags/${crag._id}`)
          })
        })
      } catch (err) {
        setError('Could not load crags: ' + (err.response?.data?.error || err.message))
      }
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [navigate])

  return (
    <div className="relative h-full min-h-screen">
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-red-100 text-red-700 px-4 py-2 rounded shadow">
          {error}
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" style={{ minHeight: 'calc(100vh - 56px)' }} />
      <button
        onClick={() => navigate('/crags/new')}
        className="absolute bottom-8 right-6 z-10 w-14 h-14 bg-amber-500 hover:bg-amber-400 text-white text-3xl rounded-full shadow-lg flex items-center justify-center font-bold"
        title="Add Crag"
      >
        +
      </button>
    </div>
  )
}
