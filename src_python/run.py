#!/usr/bin/env python3
"""
Book Writer Backend Runner
Hand-crafted with late-night coffee ☕
"""

import uvicorn
from ui import app

if __name__ == "__main__":
    print("🚀 Starting Book Writer Backend...")
    print("📚 AI-powered book idea expander ready!")
    print("🌐 API running at: http://localhost:8000")
    print("📖 Docs at: http://localhost:8000/docs")
    print("=" * 50)
    
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
