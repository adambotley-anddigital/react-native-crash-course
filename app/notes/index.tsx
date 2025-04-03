import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import AddNoteModal from '@/components/AddNoteModal'
import NoteList from '@/components/NoteList'
import { useAuth } from '@/contexts/AuthContext'
import { isErrorResponse } from '@/services/databaseService'
import noteService from '@/services/noteService'
import { Nullable } from '@/types'

export interface Note {
  $id: string
  text: string
  createdAt: string
}

const NoteScreen = () => {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])

  const [modalVisible, setModalVisible] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Nullable<string>>(null)

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
    setLoading(true)
    const response = await noteService.getNotes(user?.$id)

    setLoading(false)
    if (isErrorResponse(response)) {
      setError(response.error)
      Alert.alert('Error', response.error)
    } else {
      setNotes(response.data)
      setError(null)
    }
  }

  const addNote = async () => {
    if (!newNote.trim()) {
      return
    }

    const response = await noteService.addNote(user?.$id, newNote)

    if (isErrorResponse(response)) {
      Alert.alert('Error', response.error)
    } else {
      setNotes((prev) => [...prev, response.data])
      setNewNote('')
      setModalVisible(false)
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
      setNotes((prev) =>
        prev.map((_note) => {
          if (_note.$id === note.$id) {
            return response.data
          }

          return _note
        }),
      )
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
            setNotes(notes.filter((_note) => _note.$id !== note.$id))
          }
        },
      },
    ])
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          {error && <Text style={styles.errorText}>{error}</Text>}

          {notes.length === 0 ? (
            <Text style={styles.noNotesText}>You have no notes</Text>
          ) : (
            <NoteList notes={notes} onDelete={deleteNote} onEdit={editNote} />
          )}
        </>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setModalVisible(true)
        }}>
        <Text style={styles.addButtonText}>+ Add Note</Text>
      </TouchableOpacity>

      <AddNoteModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        newNote={newNote}
        setNewNote={setNewNote}
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
