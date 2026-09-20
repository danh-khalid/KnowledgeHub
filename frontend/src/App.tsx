import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import './App.css'

type Note = {
  id: number
  title: string
  content: string
  source: string
  tags: string
  url: string | null
}

function App() {
  const [query, setQuery] = useState('')
  const [source, setSource] = useState('all')
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    if (!query.trim()) {
      setNotes([])
      return
    }

    fetch(
      `http://127.0.0.1:8000/notes/search?q=${encodeURIComponent(query)}&source=${source}`
    )
      .then((response) => response.json())
      .then((data) => {
        setNotes(data)
      })
  }, [query, source])

  const hasSearch = query.trim().length > 0

  const clearSearch = () => {
    setQuery('')
    setSource('all')
  }

  return (
    <main className="app">
      <header className="header">
        <h1>Knowledge Hub</h1>
        <p>Search across your knowledge</p>
      </header>

      <section className="search-section">
        <input
          type="text"
          placeholder="Search notes..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <select
          value={source}
          onChange={(event) => setSource(event.target.value)}
        >
          <option value="all">All</option>
          <option value="anytype">Anytype</option>
          <option value="joplin">Joplin</option>
        </select>

        {hasSearch && (
          <button className="clear-button" onClick={clearSearch}>
            Clear
          </button>
        )}
      </section>

      <section className="results">
        {notes.map((note) => (
          <article className="note-card" key={note.id}>
            <div className="note-header">
              <h2>{note.title}</h2>

              <span className={`source ${note.source}`}>
                {note.source}
              </span>
            </div>

            <div className="content">
              <ReactMarkdown>{note.content}</ReactMarkdown>
            </div>

            {note.tags && <p className="tags">{note.tags}</p>}

            {note.url && (
              <a
                href={note.url}
                target="_blank"
                rel="noreferrer"
                className="note-link"
              >
                Open note
              </a>
            )}
          </article>
        ))}

        {hasSearch && notes.length === 0 && (
          <div className="no-results">
            <h2>No notes found</h2>
            <p>Try a different search term or source.</p>
          </div>
        )}

        {!hasSearch && (
          <div className="empty-state">
            <h2>Start searching</h2>
            <p>Search your notes by title, content, or tags.</p>
          </div>
        )}
      </section>
    </main>
  )
}

export default App
