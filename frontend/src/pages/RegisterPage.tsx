import { useState, type FormEvent } from 'react'
import { AxiosError } from 'axios'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await register({ name, email, password })
      navigate('/login', { state: { registered: true } })
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return <main className="auth-page"><form className="auth-card" onSubmit={handleSubmit}><p className="eyebrow">Virtual Closet</p><h1>Create your closet</h1><p>Start with a secure account.</p>{error && <p className="form-error" role="alert">{error}</p>}<label>Name<input required minLength={2} maxLength={100} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} /></label><label>Email<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Password<input required type="password" minLength={12} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} /><span>12+ characters with upper, lower, number, and symbol.</span></label><button className="button-primary w-full" disabled={isSubmitting}>{isSubmitting ? 'Creating account…' : 'Create account'}</button><Link to="/login">Already have an account? Sign in</Link></form></main>
}

function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError && typeof error.response?.data?.detail === 'string') return error.response.data.detail
  return 'Unable to create your account. Please try again.'
}
