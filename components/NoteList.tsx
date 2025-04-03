import React, { FC } from 'react'
import { FlatList, View } from 'react-native'

import NoteItem from './NoteItem'

import { Note } from '@/app/notes'

interface NoteListProps {
  notes: Note[]
  onDelete: (note: Note) => void
  onEdit: (note: Note, text: string) => void
}

const NoteList: FC<NoteListProps> = ({ notes, onDelete, onEdit }) => {
  return (
    <View>
      <FlatList
        data={notes}
        keyExtractor={(note) => note.$id}
        renderItem={({ item }) => <NoteItem note={item} onDelete={onDelete} onEdit={onEdit} />}
      />
    </View>
  )
}

export default NoteList
