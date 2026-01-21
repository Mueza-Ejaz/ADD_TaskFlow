#!/usr/bin/env python3
"""
Simple server runner to avoid multiprocessing issues on Windows
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from the same directory as this script
script_dir = Path(__file__).parent
dotenv_path = script_dir / ".env"

# Explicitly load the .env file
if dotenv_path.exists():
    print(f"Loading .env from: {dotenv_path}")
    load_dotenv(dotenv_path=dotenv_path)
    
    # Fallback: Manual loading if DATABASE_URL is missing (handling potential BOM or parsing issues)
    if not os.getenv("DATABASE_URL"):
        print("[INFO] DATABASE_URL not found after load_dotenv. Attempting manual loading...")
        try:
            with open(dotenv_path, 'r', encoding='utf-8-sig') as f:
                for line in f:
                    line = line.strip()
                    if line.startswith('DATABASE_URL='):
                        # Extract the value, handling quotes
                        value = line.split('=', 1)[1].strip()
                        if value.startswith('"') and value.endswith('"'):
                            value = value[1:-1]
                        elif value.startswith("'") and value.endswith("'"):
                            value = value[1:-1]
                        os.environ['DATABASE_URL'] = value
                        print(f"[OK] Manually set DATABASE_URL from .env")
                        break
        except Exception as e:
            print(f"[ERROR] Could not manually load .env: {e}")
else:
    print(f"Warning: .env file not found at {dotenv_path}")

import uvicorn
from src.main import app

if __name__ == "__main__":
    print("🚀 Starting TaskFlow Backend Server...")
    print("📍 Server will be available at: http://localhost:8000")
    print("🛑 Press Ctrl+C to stop the server")
    print()

    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
        reload=False,  # Disabled to prevent multiprocessing issues on Windows
        workers=1      # Single worker to avoid issues
    )