books = []

def add_book(title, author, desc):
    books.append({"title": title, "author": author, "desc": desc})
    return len(books) - 1  # ID
