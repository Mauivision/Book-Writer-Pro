from fastapi import FastAPI
from book import add_book
from ai import ask_llm

app = FastAPI()

@app.post("/write")
def write(prompt: str):
    # let AI expand your idea
    expanded = ask_llm(f"Expand this book idea in 100 words: {prompt}")
    id = add_book(prompt, "You", expanded)
    print(f"[{len(books)} books] New idea added: {prompt}")
    return {"book_id": id, "preview": expanded}
