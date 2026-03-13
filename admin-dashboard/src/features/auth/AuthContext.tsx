import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { AuthUser, LoginCredentials } from '@/lib/types'

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'admin_auth_token'
const USER_KEY = 'admin_auth_user'

// Simulated user for demo
const DEMO_USER: AuthUser = {
  id: 1,
  name: 'Admin Demo',
  email: 'admin@demo.com',
  role: 'admin',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEY)
    const storedUser = localStorage.getItem(USER_KEY)

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(USER_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (credentials: LoginCredentials): Promise<void> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Demo validation - in production, this would call a real API
    if (credentials.email === 'admin@demo.com' && credentials.password === '123456') {
      const token = `fake_jwt_token_${Date.now()}`
      localStorage.setItem(STORAGE_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(DEMO_USER))
      setUser(DEMO_USER)
    } else {
      throw new Error('Credenciais inválidas')
    }
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
