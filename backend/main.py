from fastapi import FastAPI

from backend.routers.notes import router as notes_router

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "Knowledge Hub API is running"}


app.include_router(notes_router)