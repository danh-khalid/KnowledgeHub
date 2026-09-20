import os
import sqlite3

import requests
from dotenv import load_dotenv


load_dotenv()

ANYTYPE_API_URL = os.getenv("ANYTYPE_API_URL")
ANYTYPE_API_KEY = os.getenv("ANYTYPE_API_KEY")

SPACE_ID = "bafyreidefpl2jjconyr4gszqzvuhlwoxjfafgxh2e3lsitkrxye27cvwoa.3d4dej9yrx9ne"
KNOWLEDGE_HUB_DB = r"data\knowledgehub.db"


def get_anytype_pages():
    headers = {
        "Authorization": f"Bearer {ANYTYPE_API_KEY}"
    }

    response = requests.get(
        f"{ANYTYPE_API_URL}/v1/spaces/{SPACE_ID}/objects?type=page",
        headers=headers,
    )

    response.raise_for_status()

    return response.json()["data"]


def get_page_content(object_id):
    headers = {
        "Authorization": f"Bearer {ANYTYPE_API_KEY}"
    }

    response = requests.get(
        f"{ANYTYPE_API_URL}/v1/spaces/{SPACE_ID}/objects/{object_id}",
        headers=headers,
    )

    response.raise_for_status()

    return response.json()


def import_notes():
    pages = get_anytype_pages()

    connection = sqlite3.connect(KNOWLEDGE_HUB_DB)

    imported = 0
    updated = 0

    for page in pages:
        object_id = page["id"]
        title = page.get("name") or "Untitled"

        details = get_page_content(object_id)
        markdown = details["object"].get("markdown", "")

        url = f"anytype://object?objectId={object_id}&spaceId={SPACE_ID}"

        existing = connection.execute(
            """
            SELECT id
            FROM notes
            WHERE title = ? AND source = 'anytype'
            """,
            (title,),
        ).fetchone()

        if existing:
            connection.execute(
                """
                UPDATE notes
                SET content = ?, url = ?
                WHERE id = ?
                """,
                (markdown, url, existing[0]),
            )

            updated += 1
            continue

        connection.execute(
            """
            INSERT INTO notes (title, content, source, tags, url)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                title,
                markdown,
                "anytype",
                "",
                url,
            ),
        )

        imported += 1

    connection.commit()
    connection.close()

    print(f"imported: {imported}")
    print(f"updated: {updated}")


if __name__ == "__main__":
    import_notes()
