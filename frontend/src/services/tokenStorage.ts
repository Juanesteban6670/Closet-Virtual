const ACCESS_TOKEN_KEY = 'virtual-closet.access-token'

let accessToken: string | null = localStorage.getItem(ACCESS_TOKEN_KEY)

export function getAccessToken(): string | null {
  return accessToken
}

export function setAccessToken(token: string): void {
  accessToken = token
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function clearAccessToken(): void {
  accessToken = null
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}
