import Button from './components/Button'

function App() {
  return (
    <main>
      <section>
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
        <div className="mt-8 flex justify-center">
          <Button label="test secondary" variant='secondary' />
          <Button label="test primary" variant='primary' />
        </div>
      </section>
    </main>
  )
}

export default App
