// src/shared/config/api-client.ts — bridge duy nhất FE → BE
import { supabase } from './supabase'

// Hỗ trợ cả VITE_ (Vite) và NEXT_PUBLIC_ (Next.js)
const BASE_URL =
  (typeof import.meta !== 'undefined' &&
    (import.meta as { env?: Record<string, string> }).env?.VITE_API_URL) ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:3000/api'

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
    public details?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })

  if (res.status === 204) return undefined as T

  const json = await res.json().catch(() => ({ message: res.statusText }))

  if (!res.ok) {
    throw new ApiError(
      res.status,
      Array.isArray(json.message) ? json.message.join(', ') : json.message ?? res.statusText,
      json.code,
      json.details,
    )
  }

  // Unwrap { data: ... } envelope từ backend
  return ('data' in json ? json.data : json) as T
}

export const api = {
  get:    <T>(path: string)                  => request<T>('GET',    path),
  post:   <T>(path: string, body?: unknown)  => request<T>('POST',   path, body),
  patch:  <T>(path: string, body?: unknown)  => request<T>('PATCH',  path, body),
  put:    <T>(path: string, body?: unknown)  => request<T>('PUT',    path, body),
  delete: <T>(path: string)                  => request<T>('DELETE', path),
}

// Backward compat alias
export const apiClient = api
