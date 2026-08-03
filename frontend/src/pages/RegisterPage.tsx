import { Link } from 'react-router-dom'

export function RegisterPage() {
  return <main className="auth-page"><section className="auth-card"><h1>Create your closet</h1><p>Registration will be available soon.</p><Link to="/login">Already have an account? Sign in</Link></section></main>
}
