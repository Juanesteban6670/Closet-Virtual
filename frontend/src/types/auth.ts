import type { Dispatch, SetStateAction } from 'react'

export interface AuthUser {
  id: string
  email: string
}

export interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  setUser: Dispatch<SetStateAction<AuthUser | null>>
}
