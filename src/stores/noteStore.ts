import { defineStore } from 'pinia'
import { NoteService } from '@/services/noteService'

export const useNoteStore = defineStore('note', {
    state: () => ({
        notes: [],
        loading: false,
        error: null as string | null,
        searchText: '',
        sortOrder: 'none',
    }),

    getters: {
        filteredNotes(state) {
            let result = [...state.notes]

            const keyword = state.searchText.trim().toLowerCase()
            if (keyword) {
                result = result.filter(note =>
                    note.title.toLowerCase().startsWith(keyword)
                )
            }

            if (state.sortOrder === 'az') {
                result.sort((a, b) =>
                    a.title.localeCompare(b.title)
                )
            } else if (state.sortOrder === 'za') {
                result.sort((a, b) =>
                    b.title.localeCompare(a.title)
                )
            }

            return result
        }
    },

    actions: {
        async fetchNotes() {
            this.loading = true
            this.error = null
            try {
                this.notes = await NoteService.getAllNotes()
        
            } catch (err) {
                this.error = 'Failed to load users'
            } finally {
                this.loading = false
            }
        },
        async addNote(note) {

            if (!note.title) {
                this.error = 'Title is required'
                return
            }
            const tempNote = {
                id: Date.now(), // temporary ID
                title: note.title,
                content: note.content
            }

            this.notes.unshift(tempNote)

            try {
                const saved = await NoteService.createNote(note)

                // replace temp note with real note from API
                const index = this.notes.findIndex(n => n.noteId === tempNote.id)
                if (index !== -1) {
                    this.notes[index] = saved
                }
            } catch (err) {
                // rollback if API fails
                this.notes = this.notes.filter(n => n.id !== tempNote.id)
                this.error = 'Failed to save note'
            }

        },

        async updateNote(id, note) {

            const index = this.notes.findIndex(n => n.noteId === id)

            if (index === -1) return
            const backup = { ...this.notes[index] }
            this.notes[index] = { ...note }
            try {

                const updated = await NoteService.updateNote(id, note)
                this.notes[index] = updated

            } catch (err) {

                this.notes[index] = backup
                this.error = 'Update failed'
            }

        },

        async deleteNote(noteId) {
            const backup = [...this.notes];
            this.notes = this.notes.filter(n => n.noteId !== noteId)
            try {
                await NoteService.deleteNote(noteId)
            } catch (err) {
                // Rollback if API fails
                this.notes = backup
                this.error = 'Delete failed'
            }
        },

        setSort(order) {
            this.sortOrder = order
        }

    },
})
