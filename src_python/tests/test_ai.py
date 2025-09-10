import unittest
from unittest.mock import patch, Mock
import sys
import os

# Add parent directory to path to import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ai import ask_llm

class TestAI(unittest.TestCase):
    
    @patch('requests.post')
    def test_ask_llm_success(self, mock_post):
        # Mock successful response
        mock_response = Mock()
        mock_response.json.return_value = {"response": "This is a test response"}
        mock_response.raise_for_status.return_value = None
        mock_post.return_value = mock_response
        
        result = ask_llm("Test prompt")
        self.assertEqual(result, "This is a test response")
    
    @patch('requests.post')
    def test_ask_llm_error(self, mock_post):
        # Mock error response
        mock_post.side_effect = Exception("Connection error")
        
        result = ask_llm("Test prompt")
        self.assertTrue(result.startswith("[Error]"))

if __name__ == '__main__':
    unittest.main()
