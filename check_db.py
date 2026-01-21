import sqlite3
import os

db_files = ['taskflow.db', 'backend/taskflow.db']

for db_file in db_files:
    if os.path.exists(db_file):
        print(f"Checking {db_file}...")
        try:
            conn = sqlite3.connect(db_file)
            cur = conn.cursor()
            cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
            tables = cur.fetchall()
            print(f"  Tables: {tables}")
            if ('task',) in tables or ('Task',) in tables:
                table_name = 'task' if ('task',) in tables else 'Task'
                cur.execute(f"SELECT count(*) FROM {table_name}")
                count = cur.fetchone()[0]
                print(f"  Task count: {count}")
                
                # Check last modified task
                try:
                    cur.execute(f"SELECT title, updated_at FROM {table_name} ORDER BY updated_at DESC LIMIT 1")
                    last_task = cur.fetchone()
                    if last_task:
                        print(f"  Last updated task: {last_task[0]} at {last_task[1]}")
                except:
                    pass
            conn.close()
        except Exception as e:
            print(f"  Error checking {db_file}: {e}")
    else:
        print(f"{db_file} does not exist.")
