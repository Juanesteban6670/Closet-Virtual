import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6">
      <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">Virtual Closet</p>
      <h1 className="mt-4 text-5xl font-bold tracking-tight">Your wardrobe, in one place.</h1>
      <p className="mt-5 max-w-xl text-lg text-slate-600">Organise garments and create looks with a visual outfit canvas.</p>
      <div className="mt-8 flex gap-4"><Link className="button-primary" to="/register">Get started</Link><Link className="button-secondary" to="/login">Sign in</Link></div>
    </main>
  )
}
