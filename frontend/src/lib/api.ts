// API configuration and helper functions
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

// Helper function to make API calls to your Flask backend
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  // Add auth token if available
  const token = localStorage.getItem("token")
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Network error" }))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Auth API calls - these call your Flask backend
export const authAPI = {
  login: (email: string, password: string) =>
    apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (userData: {
    name: string
    email: string
    password: string
    ethnicity?: string
    age?: string
    city?: string
    gender?: string
    sexual_orientation?: string
    hobby?: string
    language?: string
  }) =>
    apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
}

// Spaces API calls - these call your Flask backend
export const spacesAPI = {
  getCategories: () => apiCall("/spaces/categories"),

  getSpaces: (
    params: {
      category?: string // Now this refers to café/library/park
      type?: string // Now this refers to commercial/private
      page?: number
      limit?: number
    } = {},
  ) => {
    const searchParams = new URLSearchParams()
    if (params.category) searchParams.append("category", params.category)
    if (params.type) searchParams.append("type", params.type)
    if (params.page) searchParams.append("page", params.page.toString())
    if (params.limit) searchParams.append("limit", params.limit.toString())

    return apiCall(`/spaces?${searchParams.toString()}`)
  },

  getSpace: (id: string) => apiCall(`/spaces/${id}`),

  createSpace: (spaceData: any) =>
    apiCall("/spaces", {
      method: "POST",
      body: JSON.stringify(spaceData),
    }),

  updateSpace: (id: string, spaceData: any) =>
    apiCall(`/spaces/${id}`, {
      method: "PUT",
      body: JSON.stringify(spaceData),
    }),

  deleteSpace: (id: string) =>
    apiCall(`/spaces/${id}`, {
      method: "DELETE",
    }),
}
