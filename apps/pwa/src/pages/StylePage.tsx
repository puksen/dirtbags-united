import type { ReactNode } from 'react'
import type { LogEntry } from '../components/TicklistEntry'

import Button from '../components/Button'
import TicklistEntry from '../components/TicklistEntry'

const sampleEntry: LogEntry = {
  id: 5,
  date: '2026-04-23',
  routeName: 'Action Directe',
  cragName: 'Waldkopf',
  sectorName: 'Hauptsektor',
  grade: '9a',
  tickType: 'Rotpunkt',
  rating: 5,
}

const sampleEntry2: LogEntry = {
  id: 2,
  date: '2026-04-20',
  routeName: 'Dampfhammer',
  cragName: 'Weißenstein',
  sectorName: 'Sektor B',
  grade: '8',
  tickType: 'Onsight',
  rating: 5
}

const sampleEntry3: LogEntry = {
  id: 3,
  date: '2026-04-21',
  routeName: 'Wallstreet',
  cragName: 'Krottenseer Forst',
  sectorName: 'Hauptwand',
  grade: '8b',
  tickType: 'Flash',
  rating: 5,
}

const sampleEntry4: LogEntry = {
  id: 4,
  date: '2026-04-22',
  routeName: 'Sautanz',
  cragName: 'Roter Fels',
  sectorName: 'Rechte Wand',
  grade: '7c+',
  tickType: 'Go',
  rating: 4,
}

const sampleEntry6: LogEntry = {
  id: 6,
  date: '2026-04-24',
  routeName: 'Magnet',
  cragName: 'Weißenstein',
  sectorName: 'Linke Wand',
  grade: '7b',
  tickType: 'Toprope',
  rating: 4,
}

const sampleEntries: LogEntry[] = [
  sampleEntry,
  sampleEntry2,
  sampleEntry3,
  sampleEntry4,
  sampleEntry6,
]

type ShowcaseSection = {
  title: string
  description: string
  content: ReactNode
}

const showcaseSections: ShowcaseSection[] = [
  {
    title: 'Buttons',
    description: 'Alle visuellen Button-Varianten aus dem aktuellen PWA-Set.',
    content: (
      <div className="flex flex-wrap gap-3">
        <Button label="Primary" variant="primary" />
        <Button label="Secondary" variant="secondary" />
      </div>
    ),
  },
  {
    title: 'Ticklist Entry',
    description: 'Ein typischer Logbuch-Eintrag mit Route, Grad und Tick-Typ.',
    content: (
      <div className="max-w-2xl space-y-3">
        {sampleEntries.map((entry) => (
          <TicklistEntry key={entry.id} entry={entry} />
        ))}
      </div>
    ),
  },
  {
    title: 'Navbar',
    description: 'Die Bottom-Navigation der App bleibt global im Layout sichtbar.',
    content: (
      <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-sm text-stone-600 shadow-sm">
        Die Navbar ist im Layout verankert und wird auf allen Hauptseiten automatisch mitgerendert.
      </div>
    ),
  },
]

export default function StylePage() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">Styleguide</p>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">Komponenten-Übersicht</h1>
        <p className="max-w-2xl text-sm leading-6 text-stone-600">
          Diese Seite ist der zentrale Ort, um alle wiederverwendbaren Komponenten der PWA zu sammeln und visuell zu prüfen.
          Neue Komponenten kommen einfach als neue Sektion in diese Liste dazu.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-stone-900">Pflege-Regel</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Wenn du eine neue Komponente anlegst, ergänze hier direkt eine Vorschau samt kurzer Beschreibung. So bleibt der
            Überblick zentral und du siehst Styling, Abstände und Zustände an einem Ort.
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-stone-900">Route</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Die Seite erreichst du unter <span className="font-medium text-stone-800">/styleguide</span>. Sie ist bewusst
            nicht Teil der Bottom-Navigation, damit die Hauptnavigation für die App-Features sauber bleibt.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        {showcaseSections.map((section) => (
          <article key={section.title} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-stone-900">{section.title}</h2>
              <p className="text-sm leading-6 text-stone-600">{section.description}</p>
            </div>
            <div className="mt-5">{section.content}</div>
          </article>
        ))}
      </section>
    </div>
  )
}
