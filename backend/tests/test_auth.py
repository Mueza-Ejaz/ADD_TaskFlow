import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session
from backend.src.models.user import User
from backend.src.auth.password import hash_password

@pytest.mark.asyncio
async def test_signup_user(client: TestClient):
    response = await client.post(
        "/api/v1/auth/signup",
        json={"email": "test@example.com", "password": "password123", "full_name": "Test User"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_signup_user_existing_email(client: TestClient):
    # First signup
    await client.post(
        "/api/v1/auth/signup",
        json={"email": "test2@example.com", "password": "password123"}
    )
    # Try to signup again with same email
    response = await client.post(
        "/api/v1/auth/signup",
        json={"email": "test2@example.com", "password": "password123"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"

@pytest.mark.asyncio
async def test_login_user(client: TestClient, session: Session):
    # Create user directly in DB for login test
    hashed_password = hash_password("password123")
    user = User(email="login@example.com", hashed_password=hashed_password, full_name="Login User")
    session.add(user)
    session.commit()
    session.refresh(user)

    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "login@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_login_user_invalid_credentials(client: TestClient):
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "nonexistent@example.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"

@pytest.mark.asyncio
async def test_get_me(client: TestClient, session: Session):
    # Create user and get token
    hashed_password = hash_password("password123")
    user = User(email="me@example.com", hashed_password=hashed_password, full_name="Me User")
    session.add(user)
    session.commit()
    session.refresh(user)

    login_response = await client.post(
        "/api/v1/auth/login",
        json={"email": "me@example.com", "password": "password123"}
    )
    token = login_response.json()["access_token"]

    response = await client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["email"] == "me@example.com"
    assert response.json()["full_name"] == "Me User"

@pytest.mark.asyncio
async def test_get_me_unauthorized(client: TestClient):
    response = await client.get("/api/v1/auth/me")
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"