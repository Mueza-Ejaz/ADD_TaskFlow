import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session
from backend.src.models.user import User
from backend.src.auth.password import hash_password, verify_password # Removed get_password_hash
from fastapi import HTTPException, status # Import HTTPException and status for testing

@pytest.mark.asyncio
async def test_signup_user(client: TestClient):
    response = await client.post(
        "/api/v1/auth/signup",
        json={"email": "test@example.com", "password": "strongpassword", "full_name": "Test User"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_signup_user_existing_email(client: TestClient):
    # First signup
    await client.post(
        "/api/v1/auth/signup",
        json={"email": "test2@example.com", "password": "strongpassword"}
    )
    # Try to signup again with same email
    response = await client.post(
        "/api/v1/auth/signup",
        json={"email": "test2@example.com", "password": "strongpassword"}
    )
    assert response.status_code == 409
    assert response.json()["detail"] == "Email already registered"

@pytest.mark.asyncio
async def test_login_user(client: TestClient, session: Session):
    hashed_password = hash_password("strongpassword")
    user = User(email="login@example.com", hashed_password=hashed_password, full_name="Login User")
    session.add(user)
    session.commit()
    session.refresh(user)

    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "login@example.com", "password": "strongpassword"}
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
    hashed_password = hash_password("strongpassword")
    user = User(email="me@example.com", hashed_password=hashed_password, full_name="Me User")
    session.add(user)
    session.commit()
    session.refresh(user)

    login_response = await client.post(
        "/api/v1/auth/login",
        json={"email": "me@example.com", "password": "strongpassword"}
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

def test_hash_password_short_password():
    with pytest.raises(HTTPException) as exc_info:
        hash_password("short")
    assert exc_info.value.status_code == status.HTTP_400_BAD_REQUEST
    assert exc_info.value.detail == "Password must be at least 8 characters long."

def test_verify_password_empty_plain_password():
    # bcrypt.verify returns False for empty plain_password, does not raise exception
    hashed_password = hash_password("validpassword")
    assert verify_password("", hashed_password) is False