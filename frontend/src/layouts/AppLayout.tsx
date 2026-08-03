import { Link, Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <Link to="/dashboard" className="font-semibold">Virtual Closet</Link>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10"><Outlet /></main>
    </div>
  )
}
