import { FormEvent, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import './App.css'

type Note = {
  id: number
  title: string
  content: string
  source: string
  tags: string
  url: string | null
}

const HISTORY_KEY = 'knowledgehub-search-history'
const MAX_HISTORY = 10

function App() {
  const [query, setQuery] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [source, setSource] = useState('all')
  const [notes, setNotes] = useState<Note[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    const savedHistory = localStorage.getItem(HISTORY_KEY)

    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory))
      } catch {
        setSearchHistory([])
      }
    }
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setNotes([])
      return
    }

    fetch(
      `http://127.0.0.1:8000/notes/search?q=${encodeURIComponent(searchQuery)}&source=${source}`
    )
      .then((response) => response.json())
      .then((data) => {
        setNotes(data)
      })
  }, [searchQuery, source])

  const hasSearch = searchQuery.trim().length > 0

  const saveSearchHistory = (value: string) => {
    const trimmedValue = value.trim()

    if (!trimmedValue) {
      return
    }

    const updatedHistory = [
      trimmedValue,
      ...searchHistory.filter(
        (item) => item.toLowerCase() !== trimmedValue.toLowerCase()
      ),
    ].slice(0, MAX_HISTORY)

    setSearchHistory(updatedHistory)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory))
  }

  const handleSearch = (event: FormEvent) => {
    event.preventDefault()

    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      return
    }

    saveSearchHistory(trimmedQuery)
    setSearchQuery(trimmedQuery)
    setShowHistory(false)
  }

  const handleHistoryClick = (historyItem: string) => {
    setQuery(historyItem)
    setSearchQuery(historyItem)
    setShowHistory(false)
  }

  const clearSearch = () => {
    setQuery('')
    setSearchQuery('')
    setSource('all')
    setShowHistory(false)
  }

  return (
    <main className="app">
      <header className="header">
        <h1>Knowledge Hub</h1>
        <p>Search across your knowledge</p>
      </header>

      <section className="search-section">
        <form onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search notes..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setShowHistory(true)}
            />

            {showHistory && searchHistory.length > 0 && (
              <div className="search-history">
                {searchHistory.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleHistoryClick(item)}
                  >
                    <span>⌕</span>
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          <select
            value={source}
            onChange={(event) => setSource(event.target.value)}
          >
            <option value="all">All</option>
            <option value="anytype">Anytype</option>
            <option value="joplin">Joplin</option>
          </select>

          <button type="submit">
            Search
          </button>

          {hasSearch && (
            <button
              type="button"
              className="clear-button"
              onClick={clearSearch}
            >
              Clear
            </button>
          )}
        </form>
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
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {children}
                    </a>
                  ),

                  input: ({ type, checked, ...props }) => (
                    <input
                      {...props}
                      type={type}
                      checked={checked}
                      readOnly
                    />
                  ),
                }}
              >
                {note.content}
              </ReactMarkdown>
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