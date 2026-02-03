import { defineStore } from 'pinia'
import { UserService } from '@/services/userService'
import { Users } from '@/models/userModel'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    user: null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async createUser(user) {
      try {
        const saved = await UserService.createUser(user)
      } catch (err) {
        this.error = 'Failed to create user'
      }
    },

    async getUserByUserName(username) {
      try {
        this.user = await UserService.getUserByUsername(username)    
      } catch (err) {
        this.error = 'Failed to get user name'
      }
    },
  },
})
