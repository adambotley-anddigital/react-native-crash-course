import { database } from './appwrite'

import { ErrorResponse } from '@/types'

const getErrorResponse = (message: string, error: unknown): ErrorResponse => {
  const errorMessage = error instanceof Error ? error.message : String(error)
  console.error(message, errorMessage)

  return {
    error: errorMessage,
  }
}

const databaseService = {
  async listDocuments(dbId: string, collectionId: string, queries: string[] = []) {
    try {
      const response = await database.listDocuments(dbId, collectionId, queries)
      return response.documents || []
    } catch (error) {
      return getErrorResponse('[Error listing documents]', error)
    }
  },
  async createDocument(dbId: string, collectionId: string, data: any, id = '') {
    try {
      return await database.createDocument(dbId, collectionId, id, data)
    } catch (error) {
      return getErrorResponse('[Error creating document]', error)
    }
  },
  async updateDocument(dbId: string, collectionId: string, id: string, data: any) {
    try {
      return await database.updateDocument(dbId, collectionId, id, data)
    } catch (error) {
      return getErrorResponse('[Error updating document]', error)
    }
  },
  async deleteDocument(dbId: string, collectionId: string, id: string) {
    if (!id) {
      return { error: 'Id cannot be empty' }
    }

    try {
      await database.deleteDocument(dbId, collectionId, id)
      return { success: true }
    } catch (error) {
      return getErrorResponse('[Error deleting document]', error)
    }
  },
}

export const isErrorResponse = <T>(response: T | ErrorResponse): response is ErrorResponse => {
  return response && (response as ErrorResponse).error != null
}

export default databaseService
