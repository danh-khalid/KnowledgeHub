from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers.notes import router as notes_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Knowledge Hub API is running"}


app.include_router(notes_router)