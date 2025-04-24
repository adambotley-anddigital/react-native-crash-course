import { createContext, ReactNode, useContext, useEffect } from 'react'

import authService from '@/services/authService'
import { isErrorResponse } from '@/services/databaseService'
import useAuthStore, { UserSession } from '@/stores/authStore'
import { ErrorResponse } from '@/types'

interface AuthContextType {
  user: UserSession | null
  loading: boolean
  login: (email: string, password: string) => Promise<ErrorResponse | { success: boolean }>
  register: (email: string, password: string) => Promise<ErrorResponse | { success: boolean }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: (email: string, password: string) => Promise.resolve({ success: false }),
  register: (email: string, password: string) => Promise.resolve({ success: false }),
  logout: () => Promise.resolve(),
})

interface AuthProviderProps {
  children?: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { user, setUser, loading, setLoading } = useAuthStore()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    setLoading(true)
    const response = await authService.getUser()
    setLoading(false)

    if (isErrorResponse(response)) {
      setUser(null)
    } else {
      setUser(response)
    }
  }

  const login = async (email: string, password: string) => {
    setLoading(true)
    const response = await authService.login(email, password)
    setLoading(false)

    if (isErrorResponse(response)) {
      return response
    }

    await checkUser()

    return { success: true }
  }

  const register = async (email: string, password: string) => {
    setLoading(true)
    const response = await authService.register(email, password)
    setLoading(false)

    if (isErrorResponse(response)) {
      return response
    }

    // auto-login after register
    return await login(email, password)
  }

  const logout = async () => {
    setLoading(true)
    await authService.logout()
    setLoading(false)

    setUser(null)
    await checkUser()
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
