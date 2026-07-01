import api from './client'
import type{
  LoginRequest,
  TokenResponse,
  SalesTokenResponse,
  ChangePasswordRequest,
  ChangeSalesPasswordRequest,
  RecoverPasswordRequest,
} from '../types'

export const authApi = {
  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const res = await api.post('/auth/login', data)
    return res.data
  },

  salesVerify: async (password: string): Promise<SalesTokenResponse> => {
    const res = await api.post('/auth/sales-verify', { password })
    return res.data
  },

  me: async () => {
    const res = await api.get('/auth/me')
    return res.data
  },

  changePassword: async (data: ChangePasswordRequest) => {
    const res = await api.patch('/auth/change-password', data)
    return res.data
  },

  changeSalesPassword: async (data: ChangeSalesPasswordRequest) => {
    const res = await api.patch('/auth/change-sales-password', data)
    return res.data
  },

  recover: async (data: RecoverPasswordRequest) => {
    const res = await api.post('/auth/recover', data)
    return res.data
  },
}