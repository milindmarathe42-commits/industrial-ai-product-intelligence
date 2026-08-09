import os

from datetime import datetime, timedelta, timezone

from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from jose import jwt, JWTError

from passlib.context import CryptContext

from fastapi.security import OAuth2PasswordBearer

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


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/login"
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

    expire = datetime.now(
        timezone.utc
    ) + timedelta(

        minutes=ACCESS_TOKEN_EXPIRE_MINUTES

    )

    to_encode.update({

        "exp": expire

    })

    return jwt.encode(

        to_encode,

        SECRET_KEY,

        algorithm=ALGORITHM

    )


# =========================================================
# GET CURRENT USER
# =========================================================

def get_current_user(

    token: str = Depends(oauth2_scheme),

    db: Session = Depends(get_db)

):

    credentials_exception = HTTPException(

        status_code=401,

        detail="Invalid or expired authentication token.",

        headers={
            "WWW-Authenticate": "Bearer"
        }

    )


    try:

        payload = jwt.decode(

            token,

            SECRET_KEY,

            algorithms=[ALGORITHM]

        )

        email = payload.get("sub")


        if not email:

            raise credentials_exception


    except JWTError:

        raise credentials_exception


    user = db.query(User).filter(

        User.email == email

    ).first()


    if not user:

        raise credentials_exception


    return user


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

    token = create_access_token({

        "sub": db_user.email

    })


    return {

        "access_token": token,

        "token_type": "bearer",

        "user": {

            "id": db_user.id,

            "name": db_user.full_name,

            "email": db_user.email

        }

    }
