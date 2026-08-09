import os

from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from jose import jwt
from passlib.context import CryptContext

from app.database import get_db
from app.models.user import User
from app.models.user_schema import UserRegister, UserLogin


router = APIRouter()


# =========================================================
# SECURITY CONFIGURATION
# =========================================================

SECRET_KEY = os.getenv("SECRET_KEY")

if not SECRET_KEY:

    raise RuntimeError(
        "SECRET_KEY environment variable is not configured."
    )


ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24


pwd_context = CryptContext(

    schemes=["bcrypt"],

    deprecated="auto"

)


# =========================================================
# PASSWORD FUNCTIONS
# =========================================================

def hash_password(password):

    return pwd_context.hash(password)


def verify_password(plain, hashed):

    return pwd_context.verify(

        plain,

        hashed

    )


# =========================================================
# JWT TOKEN
# =========================================================

def create_access_token(data):

    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(

        minutes=ACCESS_TOKEN_EXPIRE_MINUTES

    )

    to_encode.update(

        {

            "exp": expire

        }

    )

    return jwt.encode(

        to_encode,

        SECRET_KEY,

        algorithm=ALGORITHM

    )


# =========================================================
# REGISTER
# =========================================================

@router.post("/register")
def register(

    user: UserRegister,

    db: Session = Depends(get_db)

):

    existing = db.query(User).filter(

        User.email == user.email

    ).first()


    if existing:

        raise HTTPException(

            status_code=400,

            detail="Email already registered"

        )


    new_user = User(

        full_name=user.full_name,

        email=user.email,

        password=hash_password(

            user.password

        )

    )


    db.add(new_user)

    db.commit()

    db.refresh(new_user)


    return {

        "message": "Registration Successful"

    }


# =========================================================
# LOGIN
# =========================================================

@router.post("/login")
def login(

    user: UserLogin,

    db: Session = Depends(get_db)

):

    db_user = db.query(User).filter(

        User.email == user.email

    ).first()


    # User does not exist
    if not db_user:

        raise HTTPException(

            status_code=404,

            detail="User not found. Please register first."

        )


    # Password is incorrect
    if not verify_password(

        user.password,

        db_user.password

    ):

        raise HTTPException(

            status_code=401,

            detail="Invalid password. Please try again."

        )


    # Create login token
    token = create_access_token(

        {

            "sub": db_user.email

        }

    )


    return {

        "access_token": token,

        "token_type": "bearer",

        "user": {

            "id": db_user.id,

            "name": db_user.full_name,

            "email": db_user.email

        }

    }
