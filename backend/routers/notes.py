import sqlite3

from fastapi import APIRouter

router = APIRouter()


@router.get("/notes")
def get_notes():
    connection = sqlite3.connect("data/knowledgehub.db")
    connection.row_factory = sqlite3.Row

    notes = connection.execute(
        "SELECT id, title, content, source, tags FROM notes"
    ).fetchall()

    connection.close()

    return [dict(note) for note in notes]