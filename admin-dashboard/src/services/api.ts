import type { User, Product, Metrics } from '@/lib/types'

const API_URL = '/api'

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Users API
export const usersApi = {
  getAll: async (params?: {
    page?: number
    limit?: number
    search?: string
    role?: string
    status?: string
  }) => {
    // Build filter params (same for both queries)
    const filterParams = new URLSearchParams()
    if (params?.search) filterParams.set('q', params.search)
    if (params?.role) filterParams.set('role', params.role)
    if (params?.status) filterParams.set('status', params.status)

    const filterQuery = filterParams.toString()

    // Get total count first (without pagination)
    const totalUrl = `/users${filterQuery ? `?${filterQuery}` : ''}`
    const totalResponse = await fetch(`${API_URL}${totalUrl}`)
    const allData = await totalResponse.json()
    const total = Array.isArray(allData) ? allData.length : 0

    // Get paginated data
    const paginatedParams = new URLSearchParams(filterParams)
    if (params?.page) paginatedParams.set('_page', String(params.page))
    if (params?.limit) paginatedParams.set('_limit', String(params.limit))

    const paginatedQuery = paginatedParams.toString()
    const paginatedUrl = `/users${paginatedQuery ? `?${paginatedQuery}` : ''}`

    const response = await fetch(`${API_URL}${paginatedUrl}`)
    const data = await response.json()

    return {
      data: data as User[],
      total,
    }
  },

  getById: (id: number) => fetchApi<User>(`/users/${id}`),

  create: (user: Omit<User, 'id'>) =>
    fetchApi<User>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    }),

  update: (id: number, user: Partial<User>) =>
    fetchApi<User>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(user),
    }),

  delete: (id: number) =>
    fetchApi<void>(`/users/${id}`, {
      method: 'DELETE',
    }),
}

// Products API
export const productsApi = {
  getAll: async (params?: {
    page?: number
    limit?: number
    search?: string
    category?: string
    status?: string
  }) => {
    // Build filter params (same for both queries)
    const filterParams = new URLSearchParams()
    if (params?.search) filterParams.set('q', params.search)
    if (params?.category) filterParams.set('category', params.category)
    if (params?.status) filterParams.set('status', params.status)

    const filterQuery = filterParams.toString()

    // Get total count first (without pagination)
    const totalUrl = `/products${filterQuery ? `?${filterQuery}` : ''}`
    const totalResponse = await fetch(`${API_URL}${totalUrl}`)
    const allData = await totalResponse.json()
    const total = Array.isArray(allData) ? allData.length : 0

    // Get paginated data
    const paginatedParams = new URLSearchParams(filterParams)
    if (params?.page) paginatedParams.set('_page', String(params.page))
    if (params?.limit) paginatedParams.set('_limit', String(params.limit))

    const paginatedQuery = paginatedParams.toString()
    const paginatedUrl = `/products${paginatedQuery ? `?${paginatedQuery}` : ''}`

    const response = await fetch(`${API_URL}${paginatedUrl}`)
    const data = await response.json()

    return {
      data: data as Product[],
      total,
    }
  },

  getById: (id: number) => fetchApi<Product>(`/products/${id}`),

  create: (product: Omit<Product, 'id'>) =>
    fetchApi<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    }),

  update: (id: number, product: Partial<Product>) =>
    fetchApi<Product>(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(product),
    }),

  delete: (id: number) =>
    fetchApi<void>(`/products/${id}`, {
      method: 'DELETE',
    }),
}

// Metrics API
export const metricsApi = {
  get: () => fetchApi<Metrics>('/metrics'),
}
