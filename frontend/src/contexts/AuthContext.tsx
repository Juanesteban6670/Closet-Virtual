import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import { authService } from '../services/auth'
import type { AuthContextValue, AuthUser, LoginInput, RegisterInput } from '../types/auth'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    authService
      .refresh()
      .then(({ user: authenticatedUser }) => setUser(authenticatedUser))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, [])

  async function login(input: LoginInput): Promise<void> {
    const payload = await authService.login(input)
    setUser(payload.user)
  }

  async function register(input: RegisterInput): Promise<void> {
    await authService.register(input)
  }

  async function logout(): Promise<void> {
    await authService.logout()
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), isLoading, login, register, logout }),
    [user, isLoading],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext }
