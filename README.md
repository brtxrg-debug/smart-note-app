# Smart Notes App

A local-first, minimalist note-taking web application with full CRUD operations and keyword search functionality.

## Features

- **Create Notes**: Add new notes with a title and content
- **Read Notes**: View all your notes in a clean grid layout
- **Update Notes**: Edit existing notes (both title and content)
- **Delete Notes**: Remove notes with confirmation dialog
- **Search**: Search through notes by keywords in both title and content with highlighting
- **Sort Notes**: Sort by date (newest/oldest) or title (A-Z/Z-A)
- **Date Display**: Shows creation date and last updated date for each note
- **Local Storage**: All notes are stored locally in the browser (no server required)
- **Responsive Design**: Works on desktop and mobile devices
- **Minimalist UI**: Clean, distraction-free interface

## Tech Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS variables and grid layout
- **Vanilla JavaScript**: No frameworks or external dependencies
- **localStorage API**: For local data persistence

## Getting Started

1. Simply open `index.html` in a modern web browser
2. No installation, build process, or server required

## Usage

### Creating a Note
1. Click the "+ New Note" button
2. Enter a title and content
3. Click "Save Note"

### Editing a Note
1. Click on any note card or click the edit (✏️) icon
2. Modify the title and/or content
3. Click "Save Note"

### Deleting a Note
1. Click the delete (🗑️) icon on a note card
2. Confirm the deletion

### Searching Notes
1. Type keywords in the search box at the top
2. Notes are filtered in real-time
3. Matching keywords are highlighted in yellow
4. Search works on both title and content
5. Click the "×" button to clear the search

### Sorting Notes
1. Use the "Sort by" dropdown in the header
2. Choose from:
   - **Newest First**: Sort by creation date (most recent first)
   - **Oldest First**: Sort by creation date (oldest first)
   - **Title (A-Z)**: Sort alphabetically by title
   - **Title (Z-A)**: Sort reverse alphabetically by title
3. Sorting works with search results too

## Architecture

The application follows a simple, class-based architecture:

- **NotesApp Class**: Main application controller that manages state and operations
- **localStorage**: Persistent storage for notes (survives page refresh)
- **Event-driven UI**: All interactions are handled through event listeners
- **Real-time search**: Immediate filtering and highlighting as you type

### Data Structure

Each note is stored as an object with the following properties:
```javascript
{
  id: string,           // Unique identifier
  title: string,        // Note title
  content: string,      // Note content
  createdAt: string,    // ISO timestamp
  updatedAt: string     // ISO timestamp
}
```

## Browser Compatibility

Works in all modern browsers that support:
- ES6 Classes
- localStorage API
- CSS Grid
- CSS Variables

## Development

The application is intentionally simple with no build process:
- No package manager required
- No transpilation needed
- No bundler required
- Pure, vanilla code

## License

MIT
