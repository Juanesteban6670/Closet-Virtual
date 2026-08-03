import { useState, type FormEvent } from 'react'
import { AxiosError } from 'axios'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const destination = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/dashboard'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await login({ email, password })
      navigate(destination, { replace: true })
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to sign in. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const wasRegistered = Boolean((location.state as { registered?: boolean } | null)?.registered)

  return <main className="auth-page"><form className="auth-card" onSubmit={handleSubmit}><p className="eyebrow">Virtual Closet</p><h1>Welcome back</h1><p>Sign in to access your wardrobe.</p>{wasRegistered && <p className="form-success" role="status">Your account was created. You can sign in now.</p>}{error && <p className="form-error" role="alert">{error}</p>}<label>Email<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Password<input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /></label><button className="button-primary w-full" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Sign in'}</button><Link to="/register">Need an account? Register</Link></form></main>
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError && typeof error.response?.data?.detail === 'string') return error.response.data.detail
  return fallback
}
