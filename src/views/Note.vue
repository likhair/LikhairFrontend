<script setup>
import { onMounted } from "vue";
import { ref, computed } from "vue";
import { useNoteStore } from "@/stores/noteStore";

const noteStore = useNoteStore();

const form = ref({
  title: "",
  content: "",
});
const formEdit = ref({
  title: "",
  content: "",
});

const isSearchNote = ref(false);

const sortOrder = ref("none");
const showAddForm = ref(false);

const editingNoteId = ref(null);
const editingNote = ref(null);

computed(() => {
  if (sortOrder.value === "az") {
    noteStore.setSort("asc");
  } else {
    noteStore.setSort("desc");
  }
});

const addNote = () => {
  if (form.value.title.trim().length < 1) return;
  noteStore.addNote(form.value);
  showAddForm.value = false;
};

const readNote = (note) => {
  formEdit.value.title = note.title;
  formEdit.value.content = note.content;
  editingNoteId.value = note.noteId;
};

const editNote = () => {
  noteStore.updateNote(editingNoteId.value, formEdit.value);
  cancelEdit();
};

const cancelEdit = () => {
  editingNoteId.value = null;
  editingNote.value = null;
};

const deleteNote = (id) => {
  noteStore.deleteNote(id);
  if (editingNoteId.value === id) {
    cancelEdit();
  }
};

onMounted(() => {
  noteStore.fetchNotes();
  isSearchNote.value = true;
});

const reset = () => {
  showAddForm.value = !showAddForm.value;
  form.value.title = "";
  form.value.content = "";
};
</script>

<template>
  <div class="min-h-screen bg-white p-6">
    <!-- HEADER -->
    <div class="max-w-3xl mx-auto mb-6 text-center">
      <div class="flex justify-center items-center gap-3 text-cyan-500">
        <h1 class="text-3xl font-bold">My Notes</h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-7 h-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.8"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8 7h8M8 11h8M8 15h5M5 3h10l4 4v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
          />
        </svg>
      </div>
      <p class="text-cyan-700 mt-1">Click a note to view or edit</p>
    </div>

    <div class="max-w-3xl mx-auto bg-cyan-200 rounded-xl shadow p-5">
      <div class="flex gap-3 mb-5 items-center">
        <!-- Search -->
        <input
          v-model="noteStore.searchText"
          placeholder="Search by title..."
          class="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-cyan-300"
        />
        <!-- Sort -->
        <select
          v-model="noteStore.sortOrder"
          class="p-2 border rounded-lg focus:ring-2 focus:ring-cyan-300"
        >
          <option value="none">None</option>
          <option value="az">A - Z</option>
          <option value="za">Z - A</option>
        </select>

        <!-- Add Note -->
        <button
          @click="reset"
          class="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg"
        >
          + Add
        </button>
      </div>

      <!-- ADD NOTE FORM -->
      <div
        v-if="showAddForm"
        class="mb-5 p-4 bg-cyan-50 border border-cyan-100 rounded-lg"
      >
        <input
          v-model="form.title"
          placeholder="Note title"
          class="w-full p-2 border rounded mb-2 focus:ring-2 focus:ring-cyan-300"
        />

        <textarea
          v-model="form.content"
          placeholder="Note content"
          class="w-full p-2 border rounded mb-3 focus:ring-2 focus:ring-cyan-300"
        ></textarea>

        <div class="flex gap-2">
          <button
            @click="addNote"
            class="px-4 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded"
          >
            Add Note
          </button>

          <button
            @click="showAddForm = false"
            class="px-4 py-1 bg-gray-400 hover:bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- NOTES LIST -->
      <div
        v-for="note in noteStore.filteredNotes"
        :key="note.noteId"
        class="mb-3"
      >
        <!-- NOTE ROW -->
        <div
          @click="readNote(note)"
          class="flex justify-between items-center p-3 border rounded-lg cursor-pointer hover:bg-cyan-50 transition"
        >
          <div>
            <h3 class="font-semibold text-gray-800">
              {{ note.title }}
            </h3>
          </div>

          <!-- DELETE -->
          <button
            @click.stop="deleteNote(note.noteId)"
            class="text-cyan-600 hover:text-red-600 font-bold"
          >
            ✕
          </button>
        </div>

        <!-- EDIT FORM -->
        <div
          v-if="editingNoteId === note.noteId"
          class="mt-2 p-4 bg-cyan-50 border border-cyan-100 rounded-lg"
        >
          <input
            v-model="formEdit.title"
            class="w-full p-2 border rounded mb-2 focus:ring-2 focus:ring-cyan-300"
          />

          <textarea
            v-model="formEdit.content"
            class="w-full p-2 border rounded mb-3 focus:ring-2 focus:ring-cyan-300"
          ></textarea>

          <div class="flex gap-2">
            <button
              @click.stop="editNote"
              class="px-4 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded"
            >
              Save
            </button>

            <button
              @click.stop="cancelEdit"
              class="px-4 py-1 bg-gray-400 hover:bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- EMPTY Note -->
      <div
        v-if="noteStore.filteredNotes.length === 0"
        class="text-center text-cyan-600 mt-6"
      >
        No notes found
      </div>
    </div>
  </div>
</template>
