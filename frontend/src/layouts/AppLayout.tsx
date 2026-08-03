import { Link, Outlet, useNavigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

export function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/dashboard" className="font-semibold">Virtual Closet</Link>
          <div className="flex items-center gap-4 text-sm"><span>{user?.name}</span><button className="font-medium text-indigo-600" onClick={handleLogout}>Log out</button></div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10"><Outlet /></main>
    </div>
  )
}
