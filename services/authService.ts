import { ID } from 'react-native-appwrite'

import { account } from './appwrite'

import { ErrorResponse } from '@/types'

const getErrorResponse = (error: unknown): ErrorResponse => {
  const errorMessage = error instanceof Error ? error.stack : String(error)
  console.error('[Auth Error]', errorMessage)

  return {
    error: errorMessage!,
  }
}

const authService = {
  async register(email: string, password: string) {
    try {
      const response = await account.create(ID.unique(), email, password)
      return response
    } catch (error) {
      return getErrorResponse(error)
    }
  },
  async login(email: string, password: string) {
    try {
      const response = await account.createEmailPasswordSession(email, password)
      return response
    } catch (error) {
      return getErrorResponse(error)
    }
  },
  async getUser() {
    try {
      return await account.get()
    } catch (error) {
      return null
    }
  },
  async logout() {
    try {
      await account.deleteSession('current')
    } catch (error) {
      getErrorResponse(error)
    }
  },
}

export default authService
