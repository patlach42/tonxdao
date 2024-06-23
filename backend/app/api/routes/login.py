import json
import time
from datetime import timedelta, datetime
from typing import Annotated, Any

import hmac
import hashlib
import jwt
import pydantic
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordRequestForm
from urllib.parse import unquote, parse_qs

from app import crud
from app.api.deps import CurrentUser, SessionDep, RedisDep
from app.api.routes.cenrifugo import get_user_energy
from app.core import security
from app.core.config import settings
from app.game import GameSession
from app.models import Token, UserPublic, User

router = APIRouter()


class TelegramInitData(pydantic.BaseModel):
    initData: str


def validate_telegram_init_data(init_data, token, c_str="WebAppData"):
    """
    Validates the data received from the Telegram web app, using the
    method documented here:
    https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app

    hash_str - the has string passed by the webapp
    init_data - the query string passed by the webapp
    token - Telegram bot's token
    c_str - constant string (default = "WebAppData")
    """

    splitted_data = unquote(init_data).split("&")
    hash_str = splitted_data[-1].split("=")[1]
    init_data = sorted([ chunk.split("=")
          for chunk in unquote(init_data).split("&")
            if chunk[:len("hash=")]!="hash="],
        key=lambda x: x[0])
    init_data = "\n".join([f"{rec[0]}={rec[1]}" for rec in init_data])

    secret_key = hmac.new(c_str.encode(), token.encode(),
        hashlib.sha256 ).digest()
    data_check = hmac.new( secret_key, init_data.encode(),
        hashlib.sha256)

    return data_check.hexdigest() == hash_str


@router.post("/login/web-app")
def login_telegram_web_app(
    session: SessionDep, telegram_data: TelegramInitData
) -> Token:
    if not validate_telegram_init_data(telegram_data.initData, settings.APP_TELEGRAM_BOT_TOKEN):
        raise HTTPException(status_code=400, detail="Incorrect data")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    parsed_query = parse_qs(unquote(telegram_data.initData))
    parsed_user = json.loads(parsed_query["user"][0])
    user = crud.get_user_by_telegram_id(session=session, telegram_id=str(parsed_user['id']))
    if user:
        return Token(
            access_token=security.create_access_token(user.id, expires_delta=access_token_expires)
        )

    user_in = User(
        telegram_id=str(parsed_user['id']),
        email="",
        full_name=parsed_user['first_name'],
        coins=0
    )
    user = crud.create_user(session=session, user=user_in)
    return Token(
        access_token=security.create_access_token(user.id, expires_delta=access_token_expires)
    )




@router.post("/login/access-token")
def login_access_token(
    session: SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = crud.authenticate(
        session=session, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return Token(
        access_token=security.create_access_token(
            user.id, expires_delta=access_token_expires
        )
    )


@router.post("/login/test-token", response_model=UserPublic)
def test_token(current_user: CurrentUser) -> Any:
    """
    Test access token
    """
    return current_user


class CentrifugoTokenResponse(pydantic.BaseModel):
    token: str


@router.get("/centrifugo-token")
def centrifugo_token(current_user: CurrentUser) -> CentrifugoTokenResponse:
    payload = {
        "sub": str(current_user.id),
        "exp": datetime.utcnow() + timedelta(minutes=60),
    }
    token = jwt.encode(payload, settings.CENTRIFUGO_TOKEN_HMAC_SECRET_KEY, algorithm="HS256")
    return CentrifugoTokenResponse(token=token)


@router.get("/profile")
async def profile(current_user: CurrentUser, session: SessionDep, redis: RedisDep) -> UserPublic:
    u = current_user.dict()
    game_session = GameSession(current_user.id)
    await game_session.setup(session, redis)
    u["coins"] = game_session.data.coins
    last_energy_change = float(await redis.hget(f"user:{current_user.id}", "last_energy_change"))
    last_energy = float(await redis.hget(f"user:{current_user.id}", "energy"))
    u["energy"] = last_energy
    u["last_energy_change"] = last_energy_change
    return u
