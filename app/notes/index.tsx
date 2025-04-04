import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import useNoteStore from '../../stores/noteStore'

import AddNoteModal from '@/components/AddNoteModal'
import NoteList from '@/components/NoteList'
import { isErrorResponse } from '@/services/databaseService'
import noteService from '@/services/noteService'
import useAuthStore from '@/stores/authStore'
import { Note } from '@/types'

const NoteScreen = () => {
  const router = useRouter()
  const { user, loading: authLoading } = useAuthStore()
  const state = useNoteStore(useShallow((state) => state))

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth')
    }
  }, [user, authLoading])

  useEffect(() => {
    if (user) {
      fetchNotes()
    }
  }, [user])

  const fetchNotes = async () => {
    state.setLoading(true)
    const response = await noteService.getNotes(user?.$id)

    state.setLoading(false)
    if (isErrorResponse(response)) {
      state.setError(response.error)
      Alert.alert('Error', response.error)
    } else {
      state.setNotes(response.data)
      state.setError(null)
    }
  }

  const addNote = async () => {
    if (!state.newNote.trim()) {
      return
    }

    const response = await noteService.addNote(user?.$id, state.newNote)

    if (isErrorResponse(response)) {
      Alert.alert('Error', response.error)
    } else {
      state.addNote(response.data)
    }
  }

  const editNote = async (note: Note, text: string) => {
    if (!text.trim()) {
      Alert.alert('Error', 'Note text cannot be empty')
      return
    }

    const response = await noteService.updateNote(note, text)

    if (isErrorResponse(response)) {
      Alert.alert('Error', response.error)
    } else {
      state.editNote(response.data)
    }
  }

  const deleteNote = async (note: Note) => {
    if (!note.$id) {
      Alert.alert('Error', `Cannot delete a note that has't been saved to the db`)
    }

    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const response = await noteService.deleteNote(note)
          if (isErrorResponse(response)) {
            Alert.alert('Error', response.error)
          } else {
            state.deleteNote(note)
          }
        },
      },
    ])
  }

  return (
    <View style={styles.container}>
      {state.loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          {state.error && <Text style={styles.errorText}>{state.error}</Text>}

          {state.notes.length === 0 ? (
            <Text style={styles.noNotesText}>You have no notes</Text>
          ) : (
            <NoteList notes={state.notes} onDelete={deleteNote} onEdit={editNote} />
          )}
        </>
      )}

      <TouchableOpacity style={styles.addButton} onPress={state.showModal}>
        <Text style={styles.addButtonText}>+ Add Note</Text>
      </TouchableOpacity>

      <AddNoteModal
        modalVisible={state.modalVisible}
        hideModal={state.hideModal}
        newNote={state.newNote}
        setNewNote={state.setNewNote}
        addNote={addNote}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
  },
  noNotesText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 15,
  },
})

export default NoteScreen
