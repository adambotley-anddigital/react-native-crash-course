import { create } from 'zustand'
import { combine } from 'zustand/middleware'

import { Note } from '@/types'

const state = {
  notes: [] as Note[],
  error: null as string | null,
  modalVisible: false,
  loading: true,
  newNote: '',
}

const useNoteStore = create(
  combine(state, (set) => ({
    setNotes: (notes: Note[]) => {
      set({ notes })

      if (notes.length > 0) {
        set({ error: null })
      }
    },
    addNote: (note: Note) => {
      set((state) => ({
        notes: [...state.notes, note],
        modalVisible: false,
        newNote: '',
      }))
    },
    editNote: (updatedNote: Note) => {
      set((state) => ({
        notes: state.notes.map((note) => {
          if (note.$id === updatedNote.$id) {
            return updatedNote
          }

          return note
        }),
      }))
    },
    deleteNote: (note: Note) => {
      set((state) => ({ notes: state.notes.filter((_note) => _note.$id !== note.$id) }))
    },
    showModal: () => {
      set({ modalVisible: true })
    },
    hideModal: () => {
      set({ modalVisible: false })
    },
    setLoading: (loading: boolean) => {
      set({ loading })
    },
    setNewNote: (newNote: string) => {
      set({ newNote })
    },
    setError: (error: (typeof state)['error']) => {
      set({ error })
    },
  })),
)

export default useNoteStore
