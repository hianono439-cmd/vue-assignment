import { mockHttp } from './mockHttp'

export const authApi = {
  async login(credentials) {
    const response = await mockHttp.post('/auth/login', credentials)
    return response.data
  },

  async getMyProfile() {
    const response = await mockHttp.get('/auth/me')
    return response.data
  },

  async getProtectedMessage() {
    const response = await mockHttp.get('/auth/protected-message')
    return response.data
  },
}
