function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold">Arancibia Web</span>
          <ul className="flex gap-6 text-sm font-medium text-slate-600">
            <li><a href="#inicio" className="hover:text-indigo-600">Inicio</a></li>
            <li><a href="#servicios" className="hover:text-indigo-600">Servicios</a></li>
            <li><a href="#contacto" className="hover:text-indigo-600">Contacto</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section id="inicio" className="mx-auto max-w-5xl px-6 py-24 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Bienvenido a <span className="text-indigo-600">Arancibia Web</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Proyecto base con React, Vite y Tailwind CSS listo para empezar.
          </p>
          <a
            href="#contacto"
            className="mt-8 inline-block rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow hover:bg-indigo-700"
          >
            Contactar
          </a>
        </section>

        <section id="servicios" className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="mb-8 text-2xl font-bold">Servicios</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {['Servicio uno', 'Servicio dos', 'Servicio tres'].map((s) => (
              <div key={s} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-semibold">{s}</h3>
                <p className="mt-2 text-sm text-slate-600">Descripción breve del servicio.</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer id="contacto" className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Arancibia Web
      </footer>
    </div>
  )
}

export default App
