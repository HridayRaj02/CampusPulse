// Vite proxies /api only while developing locally. In production the browser
// must call the separately deployed API directly.
const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export const apiUrl = (path) => `${baseUrl}${path}`
export const apiFetch = (path, options) => fetch(apiUrl(path), options)
