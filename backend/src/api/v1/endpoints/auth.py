# from sqlalchemy.exc import IntegrityError
# from fastapi import APIRouter, Depends, HTTPException, status, Security
# from fastapi.security import OAuth2PasswordBearer
# from fastapi import Request # Import Request
# import time # Import time

# from sqlmodel import Session, select
# from typing import Optional
# from pydantic import BaseModel

# from ....database import get_session
# from ....models.user import User
# from ....auth.password import hash_password, verify_password
# from ....auth.jwt_handler import create_access_token
# from ....config import settings
# from ...deps import get_current_user # Import the actual dependency

# # In-memory store for rate limiting
# RATE_LIMIT_STORE = {}
# RATE_LIMIT_DURATION = 60 # seconds
# RATE_LIMIT_REQUESTS = 5 # requests per duration

# def rate_limit_dependency(request: Request):
#     client_ip = request.client.host
#     current_time = time.time()

#     if client_ip not in RATE_LIMIT_STORE:
#         RATE_LIMIT_STORE[client_ip] = []

#     # Remove old timestamps
#     RATE_LIMIT_STORE[client_ip] = [
#         t for t in RATE_LIMIT_STORE[client_ip] if t > current_time - RATE_LIMIT_DURATION
#     ]

#     if len(RATE_LIMIT_STORE[client_ip]) >= RATE_LIMIT_REQUESTS:
#         raise HTTPException(
#             status_code=status.HTTP_429_TOO_MANY_REQUESTS,
#             detail=f"Rate limit exceeded. Try again in {RATE_LIMIT_DURATION} seconds."
#         )

#     RATE_LIMIT_STORE[client_ip].append(current_time)


# class UserRead(BaseModel):
#     id: int
#     email: str
#     full_name: Optional[str] = None

# class UserCreate(BaseModel):
#     email: str
#     password: str
#     full_name: Optional[str] = None

# class UserLogin(BaseModel):
#     email: str
#     password: str

# class Token(BaseModel):
#     access_token: str
#     token_type: str = "bearer"

# auth_router = APIRouter(prefix="/auth", tags=["Authentication"])

# @auth_router.post("/signup", response_model=Token, dependencies=[Depends(rate_limit_dependency)]) # Apply rate limit
# async def signup_user(user_data: UserCreate, session: Session = Depends(get_session)):
#     hashed_password = hash_password(user_data.password)
#     db_user = User(email=user_data.email, hashed_password=hashed_password, full_name=user_data.full_name)

#     session.add(db_user)
#     try:
#         session.commit()
#         session.refresh(db_user)
#     except IntegrityError: # Catch specific unique constraint error
#         session.rollback()
#         raise HTTPException(
#             status_code=status.HTTP_409_CONFLICT, # Use 409 Conflict for resource conflict
#             detail="Email already registered"
#         )
#     except Exception as e: # Catch other database errors
#         session.rollback()
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, # Use 500 for general server errors
#             detail="An unexpected error occurred during signup" # Provide generic detail to avoid exposing sensitive information
#         )

#     access_token = create_access_token(data={"sub": db_user.email})
#     return {"access_token": access_token, "token_type": "bearer"}

# @auth_router.post("/login", response_model=Token, dependencies=[Depends(rate_limit_dependency)]) # Apply rate limit
# async def login_user(user_data: UserLogin, session: Session = Depends(get_session)):
#     user = session.exec(select(User).where(User.email == user_data.email)).first()
#     if not user or not verify_password(user_data.password, user.hashed_password):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect email or password",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
#     access_token = create_access_token(data={"sub": user.email})
#     return {"access_token": access_token, "token_type": "bearer"}

# @auth_router.post("/logout", dependencies=[Depends(rate_limit_dependency)]) # Apply rate limit
# async def logout_user():
#     # In a stateless JWT system, logout typically involves
#     # the client discarding the token.
#     # Optionally, a token invalidation list (blacklist) could be implemented
#     # if required, but for basic logout, client-side discard is sufficient.
#     return {"message": "Successfully logged out"}

# @auth_router.get("/me", response_model=UserRead)
# async def read_users_me(current_user: User = Depends(get_current_user)): # Use the real dependency
#     return UserRead(id=current_user.id, email=current_user.email, full_name=current_user.full_name)


from sqlalchemy.exc import IntegrityError
from fastapi import APIRouter, Depends, HTTPException, status, Security, Request
from sqlmodel import Session, select
from typing import Optional
from pydantic import BaseModel

from src.database import get_session
from src.models.user import User
from src.auth.password import hash_password, verify_password
from src.auth.jwt_handler import create_access_token
from src.config import settings
from src.api.deps import get_current_user

import time

# Rate limiting store
RATE_LIMIT_STORE = {}
RATE_LIMIT_DURATION = 60  # seconds
RATE_LIMIT_REQUESTS = 5  # requests per duration

def rate_limit_dependency(request: Request):
    client_ip = request.client.host
    current_time = time.time()

    if client_ip not in RATE_LIMIT_STORE:
        RATE_LIMIT_STORE[client_ip] = []

    RATE_LIMIT_STORE[client_ip] = [
        t for t in RATE_LIMIT_STORE[client_ip] if t > current_time - RATE_LIMIT_DURATION
    ]

    if len(RATE_LIMIT_STORE[client_ip]) >= RATE_LIMIT_REQUESTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded. Try again in {RATE_LIMIT_DURATION} seconds."
        )

    RATE_LIMIT_STORE[client_ip].append(current_time)

# --- Schemas ---
class UserRead(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# --- Router ---
auth_router = APIRouter(prefix="/auth", tags=["Authentication"])

# --- Signup ---
@auth_router.post("/signup", response_model=Token, dependencies=[Depends(rate_limit_dependency)])
async def signup_user(user_data: UserCreate, session: Session = Depends(get_session)):
    hashed_password = hash_password(user_data.password)
    db_user = User(email=user_data.email, hashed_password=hashed_password, full_name=user_data.full_name)

    session.add(db_user)
    try:
        session.commit()
        session.refresh(db_user)
        print(f"User created in signup: ID={db_user.id}, Email={db_user.email}")
    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
    except Exception:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during signup"
        )

    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# --- Login ---
@auth_router.post("/login", response_model=Token, dependencies=[Depends(rate_limit_dependency)])
async def login_user(user_data: UserLogin, session: Session = Depends(get_session)):
    print(f"Attempting login for email: {user_data.email}")
    user = session.exec(select(User).where(User.email == user_data.email)).first()
    if not user:
        print(f"User not found for email: {user_data.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not verify_password(user_data.password, user.hashed_password):
        print(f"Incorrect password for user: {user_data.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    print(f"Access token generated: {access_token[:10]}...") # Print first 10 chars
    return {"access_token": access_token, "token_type": "bearer"}

# --- Logout ---
@auth_router.post("/logout", dependencies=[Depends(rate_limit_dependency)])
async def logout_user():
    return {"message": "Successfully logged out"}

# --- Current User ---
@auth_router.get("/me", response_model=UserRead)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return UserRead(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name
    )









