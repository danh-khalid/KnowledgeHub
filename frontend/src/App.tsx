import { useEffect, useState } from 'react'
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
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/notes')
      .then((response) => response.json())
      .then((data) => {
        setNotes(data)
      })
  }, [])

  return (
    <>
      <div>
        {notes.map((note) => (
          <div key={note.id}>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
            <p>{note.source}</p>
            <p>{note.tags}</p>
            <a href={note.url ?? '#'}>{note.url}</a>
          </div>
        ))}
      </div>
    </>
  )
}

export default App