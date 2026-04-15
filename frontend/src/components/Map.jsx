import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const TYPE_COLORS = {
  crag: '#ef4444',
  parking: '#3b82f6',
  default: '#8b5cf6',
}

export default function Map({ markers = [], onMapClick, height = '400px', center, zoom = 10 }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    if (!containerRef.current) return

    const defaultCenter = center || [10.0, 47.5]

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
      center: defaultCenter,
      zoom,
    })

    mapRef.current = map

    if (onMapClick) {
      map.on('click', (e) => {
        onMapClick({ lng: e.lngLat.lng, lat: e.lngLat.lat })
      })
    }

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    markers.forEach(({ lng, lat, type = 'default', label }) => {
      if (lng == null || lat == null) return
      const color = TYPE_COLORS[type] || TYPE_COLORS.default
      const el = document.createElement('div')
      el.style.cssText = `width:16px;height:16px;border-radius:50%;background:${color};border:2px solid white;cursor:pointer;`
      if (label) el.title = label

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map)

      if (label) {
        marker.setPopup(new maplibregl.Popup({ offset: 12 }).setText(label))
      }

      markersRef.current.push(marker)
    })

    if (markers.length > 0) {
      const lngs = markers.map((m) => m.lng).filter(Boolean)
      const lats = markers.map((m) => m.lat).filter(Boolean)
      if (lngs.length > 0) {
        const bounds = [
          [Math.min(...lngs), Math.min(...lats)],
          [Math.max(...lngs), Math.max(...lats)],
        ]
        try {
          map.fitBounds(bounds, { padding: 60, maxZoom: 15, duration: 500 })
        } catch {
          // ignore fitBounds errors for single point
        }
      }
    }
  }, [markers])

  return <div ref={containerRef} style={{ height, width: '100%' }} />
}
