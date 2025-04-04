import { Models } from 'react-native-appwrite'
import { create } from 'zustand'
import { combine } from 'zustand/middleware'

export type UserSession = Models.User<Models.Preferences>

export interface AuthState {
  user: UserSession | null
  loading: boolean
}

const state: AuthState = {
  user: null,
  loading: true,
}

const useAuthStore = create(
  combine(state, (set) => ({
    setUser: (user: AuthState['user']) => {
      set({ user })
    },
    setLoading: (loading: boolean) => {
      set({ loading })
    },
  })),
)

export default useAuthStore
