import api from './api'
import { Users } from '@/models/userModel'

export const UserService = {
  async getAllUsers() {
    const res = await api.get('/api/users')
    return res.data.map(u => new Users(u))
  },

  async createUser(user) {
    const res = await api.post('/api/users', user)
    return new Users(res.data)
  },

  async getUserByUsername(username) {
    const res = await api.get(`/api/users/username/${username}`)
    return new Users(res.data)
  },
}
