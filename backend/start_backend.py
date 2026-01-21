#!/usr/bin/env python3
"""
Simple script to start the backend server
"""

# Load environment variables first and ensure they're set in the current process
import os
from dotenv import load_dotenv
import sys
from pathlib import Path

# Load .env file from the same directory as this script
script_dir = Path(__file__).parent
dotenv_path = script_dir / ".env"
load_dotenv(dotenv_path=dotenv_path)

# If dotenv didn't load the DATABASE_URL, manually read and set it
if not os.getenv("DATABASE_URL"):
    print("[INFO] Attempting manual .env loading...")
    try:
        with open(dotenv_path, 'r', encoding='utf-8-sig') as f:
            for line in f:
                line = line.strip()
                if line.startswith('DATABASE_URL='):
                    # Extract the value, handling quotes
                    value = line.split('=', 1)[1].strip()
                    if value.startswith('"') and value.endswith('"'):
                        value = value[1:-1]  # Remove surrounding quotes
                    elif value.startswith("'") and value.endswith("'"):
                        value = value[1:-1]  # Remove surrounding quotes
                    os.environ['DATABASE_URL'] = value
                    print(f"[OK] Manually set DATABASE_URL: {value[:50]}...")
                    break
    except Exception as e:
        print(f"[ERROR] Could not manually load .env: {e}")

# Verify that the environment variables are loaded
if os.getenv("DATABASE_URL"):
    print(f"[OK] DATABASE_URL loaded: {os.getenv('DATABASE_URL')[:50]}...")
else:
    print("[ERROR] DATABASE_URL not found in environment variables")

import uvicorn
from src.main import app

if __name__ == "__main__":
    print("^ Starting TaskFlow Backend Server...")
    print("@ Server will be available at: http://localhost:8000")
    print("# API endpoints available at: http://localhost:8000/api/")
    print("o Documentation available at: http://localhost:8000/docs")
    print("! Press Ctrl+C to stop the server")
    print()

    try:
        uvicorn.run(
            app,
            host="127.0.0.1",
            port=8000,
            reload=False,
            workers=1
        )
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error running server: {e}")