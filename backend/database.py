import sqlite3

connection = sqlite3.connect("data/knowledgehub.db")

cursor = connection.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    source TEXT,
    tags TEXT,
    url TEXT
)
""")

connection.commit()
connection.close()

print("database and notes table created")