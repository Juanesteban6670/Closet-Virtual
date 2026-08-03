import { useAuth } from '../hooks/useAuth'

export function DashboardPage() {
  const { user } = useAuth()
  return <section><p className="text-sm font-medium text-indigo-600">Dashboard</p><h1 className="mt-2 text-3xl font-bold">Welcome, {user?.name}.</h1><p className="mt-3 text-slate-600">Your private closet is ready for garments and outfits.</p></section>
}
