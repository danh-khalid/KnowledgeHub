import sqlite3

from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "Knowledge Hub API is running"}


@app.get("/notes")
def get_notes():
    connection = sqlite3.connect("data/knowledgehub.db")
    connection.row_factory = sqlite3.Row

    notes = connection.execute(
        "SELECT id, title, content, source, tags FROM notes"
    ).fetchall()

    connection.close()

    return [dict(note) for note in notes]