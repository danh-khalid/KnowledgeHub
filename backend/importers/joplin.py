import sqlite3

JOPLIN_DB = r"C:\Users\Danh\.config\joplin-desktop\database.sqlite"
KNOWLEDGE_HUB_DB = r"data\knowledgehub.db"


def get_joplin_notes():
    connection = sqlite3.connect(JOPLIN_DB)
    connection.row_factory = sqlite3.Row

    notes = connection.execute(
        """
        SELECT id, title, body, source_url
        FROM notes
        WHERE deleted_time = 0
        ORDER BY updated_time DESC
        """
    ).fetchall()

    connection.close()

    return [dict(note) for note in notes]


def import_notes():
    joplin_notes = get_joplin_notes()

    connection = sqlite3.connect(KNOWLEDGE_HUB_DB)

    imported = 0
    skipped = 0

    for note in joplin_notes:
        existing = connection.execute(
            """
            SELECT id
            FROM notes
            WHERE title = ? AND source = 'joplin'
            """,
            (note["title"],),
        ).fetchone()

        if existing:
            skipped += 1
            continue

        connection.execute(
            """
            INSERT INTO notes (title, content, source, tags, url)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                note["title"],
                note["body"],
                "joplin",
                "",
                note["source_url"] or None,
            ),
        )

        imported += 1

    connection.commit()
    connection.close()

    print(f"imported: {imported}")
    print(f"skipped: {skipped}")


if __name__ == "__main__":
    import_notes()