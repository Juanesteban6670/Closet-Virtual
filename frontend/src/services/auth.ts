import { api } from './api'
import { clearAccessToken, setAccessToken } from './tokenStorage'
import type { AuthPayload, LoginInput, RegisterInput } from '../types/auth'

export const authService = {
  async register(input: RegisterInput): Promise<void> {
    await api.post('/auth/register', input)
  },

  async login(input: LoginInput): Promise<AuthPayload> {
    const { data } = await api.post<AuthPayload>('/auth/login', input, {
      skipAuthRefresh: true,
    })
    setAccessToken(data.access_token)
    return data
  },

  async refresh(): Promise<AuthPayload> {
    const { data } = await api.post<AuthPayload>('/auth/refresh', undefined, {
      skipAuthRefresh: true,
    })
    setAccessToken(data.access_token)
    return data
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout', undefined, { skipAuthRefresh: true })
    } finally {
      clearAccessToken()
    }
  },
}
