import { createContext, useMemo, useState, type ReactNode } from 'react'

import type { AuthContextValue, AuthUser } from '../types/auth'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), setUser }),
    [user],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext }
