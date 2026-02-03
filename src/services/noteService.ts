import api from './api'
import { Notes } from '@/models/noteModel'

export const NoteService = {
  async getAllNotes() {
    const res = await api.get('/api/note')
    return res.data.map(u => new Notes(u))
  },

   async createNote(note) {
    const res = await api.post('/api/note', note)
    return new Notes(res.data)
  },

  async updateNote(noteId, note) {
    const res = await api.put(`/api/note/${noteId}?noteId=${noteId}`, note)
    return new Notes(res.data)
  },

  async deleteNote(noteId) {
    const rest=await api.delete(`/api/note/${noteId}?noteId=${noteId}`)
  }
}
