import { createContext } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  adminId: string | null
  login: (token: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  adminId: null,
  login: () => {},
  logout: () => {},
})
