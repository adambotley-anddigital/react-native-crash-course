import { ID, Query } from 'react-native-appwrite'

import { config } from './appwrite'
import databaseService, { isErrorResponse } from './databaseService'

import { Note } from '@/app/notes'
import { ErrorResponse } from '@/types'

const dbId = config.db
const collectionId = config.collection.notes

// Appwrite database and collection id
const noteService = {
  async getNotes(userId?: string): Promise<{ data: Note[] } | ErrorResponse> {
    if (!userId) {
      console.error('Error: Missing userId in getNotes')
      return { data: [], error: 'userId is missing' }
    }

    const response = await databaseService.listDocuments(dbId, collectionId, [
      Query.equal('userId', userId),
    ])

    if (!Array.isArray(response)) {
      return { error: response.error }
    }

    return { data: response } as unknown as { data: Note[] }
  },
  async addNote(userId: string | undefined, text: string): Promise<{ data: Note } | ErrorResponse> {
    if (!userId) {
      return { error: 'UserId require to add note' }
    }
    if (!text) {
      return { error: 'Note text cannot be empty' }
    }

    const data = {
      text,
      userId,
      createdAt: new Date().toISOString(),
    }

    const response = await databaseService.createDocument(dbId, collectionId, data, ID.unique())

    if (response.error) {
      return { error: response.error }
    }

    return { data: response } as unknown as { data: Note }
  },
  async updateNote(note: Note, text: string): Promise<{ data: Note } | ErrorResponse> {
    const response = await databaseService.updateDocument(dbId, collectionId, note.$id, { text })

    if (isErrorResponse(response)) {
      return { error: response.error }
    }

    return { data: response } as unknown as { data: Note }
  },
  async deleteNote(note: Note): Promise<{ success: boolean } | ErrorResponse> {
    const response = await databaseService.deleteDocument(dbId, collectionId, note.$id)

    if (isErrorResponse(response)) {
      return { error: response.error }
    }

    return { success: true }
  },
}

export default noteService
