import sqlite3

from fastapi import APIRouter
from fastapi.responses import FileResponse

router = APIRouter()


@router.get("/notes")
def get_notes():
    connection = sqlite3.connect("data/knowledgehub.db")
    connection.row_factory = sqlite3.Row

    notes = connection.execute(
        "SELECT id, title, content, source, tags, url FROM notes"
    ).fetchall()

    connection.close()

    return [dict(note) for note in notes]


@router.get("/notes/search")
def search_notes(q: str, source: str = "all"):
    connection = sqlite3.connect("data/knowledgehub.db")
    connection.row_factory = sqlite3.Row

    search_term = f"%{q}%"

    if source == "all":
        notes = connection.execute(
            """
            SELECT id, title, content, source, tags, url
            FROM notes
            WHERE title LIKE ?
               OR content LIKE ?
               OR tags LIKE ?
            """,
            (search_term, search_term, search_term),
        ).fetchall()
    else:
        notes = connection.execute(
            """
            SELECT id, title, content, source, tags, url
            FROM notes
            WHERE source = ?
              AND (
                  title LIKE ?
                  OR content LIKE ?
                  OR tags LIKE ?
              )
            """,
            (source, search_term, search_term, search_term),
        ).fetchall()

    connection.close()

    return [dict(note) for note in notes]


@router.get("/joplin/resources/{resource_id}")
def get_joplin_resource(resource_id: str):
    resource_path = (
        rf"C:\Users\Danh\.config\joplin-desktop\resources\{resource_id}.png"
    )

    return FileResponse(resource_path)