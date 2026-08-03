import axios from 'axios'

import { clearAccessToken, getAccessToken, setAccessToken } from './tokenStorage'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
  withCredentials: true,
})

let refreshRequest: Promise<string> | null = null

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config
    if (error.response?.status !== 401 || !request || request._retry || request.skipAuthRefresh) {
      return Promise.reject(error)
    }

    request._retry = true
    try {
      refreshRequest ??= api
        .post<{ access_token: string }>('/auth/refresh', undefined, {
          skipAuthRefresh: true,
        })
        .then(({ data }) => data.access_token)
        .finally(() => {
          refreshRequest = null
        })
      const token = await refreshRequest
      setAccessToken(token)
      request.headers = request.headers ?? {}
      request.headers.Authorization = `Bearer ${token}`
      return api(request)
    } catch (refreshError) {
      clearAccessToken()
      return Promise.reject(refreshError)
    }
  },
)
