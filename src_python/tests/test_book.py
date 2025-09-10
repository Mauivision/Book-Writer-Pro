import unittest
import sys
import os

# Add parent directory to path to import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from book import add_book, books

class TestBook(unittest.TestCase):
    
    def setUp(self):
        # Clear books list before each test
        books.clear()
    
    def test_add_book(self):
        book_id = add_book("Test Book", "Test Author", "Test Description")
        self.assertEqual(book_id, 0)
        self.assertEqual(len(books), 1)
        self.assertEqual(books[0]["title"], "Test Book")
        self.assertEqual(books[0]["author"], "Test Author")
        self.assertEqual(books[0]["desc"], "Test Description")
    
    def test_add_multiple_books(self):
        add_book("Book 1", "Author 1", "Desc 1")
        add_book("Book 2", "Author 2", "Desc 2")
        
        self.assertEqual(len(books), 2)
        self.assertEqual(books[1]["title"], "Book 2")

if __name__ == '__main__':
    unittest.main()
