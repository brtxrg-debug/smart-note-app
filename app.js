class NotesApp {
    constructor() {
        this.notes = [];
        this.currentNoteId = null;
        this.searchQuery = '';
        this.sortBy = 'dateDesc';
        
        this.init();
    }

    init() {
        this.loadNotes();
        this.attachEventListeners();
        this.renderNotes();
    }

    loadNotes() {
        const storedNotes = localStorage.getItem('smartNotes');
        if (storedNotes) {
            this.notes = JSON.parse(storedNotes);
        }
    }

    saveNotes() {
        localStorage.setItem('smartNotes', JSON.stringify(this.notes));
    }

    attachEventListeners() {
        const newNoteBtn = document.getElementById('newNoteBtn');
        const closeModal = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelBtn');
        const noteForm = document.getElementById('noteForm');
        const searchInput = document.getElementById('searchInput');
        const clearSearch = document.getElementById('clearSearch');
        const noteModal = document.getElementById('noteModal');
        const closeDeleteModal = document.getElementById('closeDeleteModal');
        const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        const deleteModal = document.getElementById('deleteModal');
        const sortSelect = document.getElementById('sortSelect');

        newNoteBtn.addEventListener('click', () => this.openNoteModal());
        closeModal.addEventListener('click', () => this.closeNoteModal());
        cancelBtn.addEventListener('click', () => this.closeNoteModal());
        noteForm.addEventListener('submit', (e) => this.handleSubmit(e));
        searchInput.addEventListener('input', (e) => this.handleSearch(e));
        clearSearch.addEventListener('click', () => this.clearSearch());
        sortSelect.addEventListener('change', (e) => this.handleSort(e));
        
        closeDeleteModal.addEventListener('click', () => this.closeDeleteModal());
        cancelDeleteBtn.addEventListener('click', () => this.closeDeleteModal());
        confirmDeleteBtn.addEventListener('click', () => this.confirmDelete());

        noteModal.addEventListener('click', (e) => {
            if (e.target === noteModal) {
                this.closeNoteModal();
            }
        });

        deleteModal.addEventListener('click', (e) => {
            if (e.target === deleteModal) {
                this.closeDeleteModal();
            }
        });
    }

    openNoteModal(noteId = null) {
        const modal = document.getElementById('noteModal');
        const modalTitle = document.getElementById('modalTitle');
        const noteTitle = document.getElementById('noteTitle');
        const noteContent = document.getElementById('noteContent');

        this.currentNoteId = noteId;

        if (noteId) {
            const note = this.notes.find(n => n.id === noteId);
            if (note) {
                modalTitle.textContent = 'Edit Note';
                noteTitle.value = note.title;
                noteContent.value = note.content;
            }
        } else {
            modalTitle.textContent = 'New Note';
            noteTitle.value = '';
            noteContent.value = '';
        }

        modal.classList.add('active');
        noteTitle.focus();
    }

    closeNoteModal() {
        const modal = document.getElementById('noteModal');
        modal.classList.remove('active');
        this.currentNoteId = null;
        document.getElementById('noteForm').reset();
    }

    openDeleteModal(noteId) {
        const modal = document.getElementById('deleteModal');
        this.currentNoteId = noteId;
        modal.classList.add('active');
    }

    closeDeleteModal() {
        const modal = document.getElementById('deleteModal');
        modal.classList.remove('active');
        this.currentNoteId = null;
    }

    confirmDelete() {
        if (this.currentNoteId) {
            this.deleteNote(this.currentNoteId);
            this.closeDeleteModal();
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const title = document.getElementById('noteTitle').value.trim();
        const content = document.getElementById('noteContent').value.trim();

        if (!title || !content) {
            return;
        }

        if (this.currentNoteId) {
            this.updateNote(this.currentNoteId, title, content);
        } else {
            this.createNote(title, content);
        }

        this.closeNoteModal();
    }

    createNote(title, content) {
        const note = {
            id: this.generateId(),
            title,
            content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.notes.unshift(note);
        this.saveNotes();
        this.renderNotes();
    }

    updateNote(id, title, content) {
        const note = this.notes.find(n => n.id === id);
        if (note) {
            note.title = title;
            note.content = content;
            note.updatedAt = new Date().toISOString();
            this.saveNotes();
            this.renderNotes();
        }
    }

    deleteNote(id) {
        this.notes = this.notes.filter(n => n.id !== id);
        this.saveNotes();
        this.renderNotes();
    }

    handleSearch(e) {
        this.searchQuery = e.target.value.trim().toLowerCase();
        const clearBtn = document.getElementById('clearSearch');
        
        if (this.searchQuery) {
            clearBtn.style.display = 'flex';
        } else {
            clearBtn.style.display = 'none';
        }

        this.renderNotes();
    }

    clearSearch() {
        const searchInput = document.getElementById('searchInput');
        const clearBtn = document.getElementById('clearSearch');
        
        searchInput.value = '';
        this.searchQuery = '';
        clearBtn.style.display = 'none';
        this.renderNotes();
    }

    handleSort(e) {
        this.sortBy = e.target.value;
        this.renderNotes();
    }

    getFilteredNotes() {
        let filtered = this.notes;

        if (this.searchQuery) {
            filtered = filtered.filter(note => {
                const titleMatch = note.title.toLowerCase().includes(this.searchQuery);
                const contentMatch = note.content.toLowerCase().includes(this.searchQuery);
                return titleMatch || contentMatch;
            });
        }

        return this.sortNotes(filtered);
    }

    sortNotes(notes) {
        const sorted = [...notes];

        switch (this.sortBy) {
            case 'dateDesc':
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'dateAsc':
                return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'titleAsc':
                return sorted.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
            case 'titleDesc':
                return sorted.sort((a, b) => b.title.toLowerCase().localeCompare(a.title.toLowerCase()));
            default:
                return sorted;
        }
    }

    highlightText(text, query) {
        if (!query) {
            return this.escapeHtml(text);
        }

        const escapedText = this.escapeHtml(text);
        const escapedQuery = this.escapeRegex(query);
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        return escapedText.replace(regex, '<span class="highlight">$1</span>');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    renderNotes() {
        const container = document.getElementById('notesContainer');
        const emptyState = document.getElementById('emptyState');
        const filteredNotes = this.getFilteredNotes();

        if (filteredNotes.length === 0) {
            container.innerHTML = '';
            if (this.notes.length === 0) {
                emptyState.style.display = 'block';
                emptyState.innerHTML = '<p>No notes yet. Create your first note to get started!</p>';
            } else {
                emptyState.style.display = 'block';
                emptyState.innerHTML = '<p>No notes found matching your search.</p>';
            }
            return;
        }

        emptyState.style.display = 'none';
        
        container.innerHTML = filteredNotes.map(note => this.createNoteCard(note)).join('');

        filteredNotes.forEach(note => {
            const card = container.querySelector(`[data-note-id="${note.id}"]`);
            const editBtn = card.querySelector('.edit-btn');
            const deleteBtn = card.querySelector('.delete-btn');

            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openNoteModal(note.id);
            });

            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openDeleteModal(note.id);
            });

            card.addEventListener('click', (e) => {
                if (!e.target.closest('.note-card-actions')) {
                    this.openNoteModal(note.id);
                }
            });
        });
    }

    createNoteCard(note) {
        const createdDate = new Date(note.createdAt);
        const updatedDate = new Date(note.updatedAt);
        const formattedCreatedDate = this.formatDate(createdDate);
        const formattedUpdatedDate = this.formatDate(updatedDate);
        const previewContent = note.content.length > 200 
            ? note.content.substring(0, 200) + '...' 
            : note.content;

        const highlightedTitle = this.highlightText(note.title, this.searchQuery);
        const highlightedContent = this.highlightText(previewContent, this.searchQuery);

        const isEdited = note.createdAt !== note.updatedAt;
        const dateInfo = isEdited 
            ? `Created: ${formattedCreatedDate} • Updated: ${formattedUpdatedDate}`
            : `Created: ${formattedCreatedDate}`;

        return `
            <div class="note-card" data-note-id="${note.id}">
                <div class="note-card-header">
                    <div class="note-card-title">${highlightedTitle}</div>
                    <div class="note-card-actions">
                        <button class="icon-btn edit-btn" title="Edit note">✏️</button>
                        <button class="icon-btn delete-btn delete" title="Delete note">🗑️</button>
                    </div>
                </div>
                <div class="note-card-content">${highlightedContent}</div>
                <div class="note-card-footer">
                    ${dateInfo}
                </div>
            </div>
        `;
    }

    formatDate(date) {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
        }
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NotesApp();
});
