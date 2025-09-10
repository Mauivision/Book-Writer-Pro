books = [] # empty list-your growing shelf

def add_book(title, author):
    books.append({"title": title, "author": author})

def show_palette():
    for book in books:
        print(f"{book['title']} • {book['author']}")

while True:
    print("\n[1] Add book [2] Show palette [3] Quit")
    pick = input("> ")
    if pick == "1":
        title = input("Title? ")
        author = input("Author? ")
        add_book(title, author)
    elif pick == "2":
        show_palette()
    elif pick == "3":
        break
