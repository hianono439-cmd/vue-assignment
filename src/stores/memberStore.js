import { defineStore } from 'pinia'

const memberStorageKey = 'weather-dashboard-member'

const readStoredMember = () => {
  try {
    return JSON.parse(localStorage.getItem(memberStorageKey))
  } catch {
    return null
  }
}

export const useMemberStore = defineStore('member', {
  state: () => ({
    member: readStoredMember(),
  }),

  getters: {
    isRegistered: (state) => Boolean(state.member),
  },

  actions: {
    register(profile) {
      this.member = {
        name: profile.name,
        email: profile.email,
        favoriteCity: profile.favoriteCity,
        joinedAt: new Date().toISOString(),
      }
      localStorage.setItem(memberStorageKey, JSON.stringify(this.member))
    },

    clearMember() {
      this.member = null
      localStorage.removeItem(memberStorageKey)
    },
  },
})
