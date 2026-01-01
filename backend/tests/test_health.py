from fastapi.testclient import TestClient
from main import app # Assuming main.py is directly in src/

client = TestClient(app)

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "version": "1.0.0"}
