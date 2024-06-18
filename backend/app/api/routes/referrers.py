from typing import Any

import pydantic
from fastapi import APIRouter

from app.api.deps import CurrentUser, SessionDep
from app.core.config import settings
from app.models import User

router = APIRouter()


class ReferrerUser(pydantic.BaseModel):
    name: str
    id: str


class ReferrersResponse(pydantic.BaseModel):
    list: list[ReferrerUser]
    link: str


@router.get("/referrers")
def referrers(current_user: CurrentUser, session: SessionDep) -> ReferrersResponse:
    return ReferrersResponse(
        # list=[{"id": '1', "name": "Referrer 1"}, {"id": '2', "name": "Referrer 2"}],
        list=[ReferrerUser(name=user.full_name, id=str(user.telegram_id)) for user in current_user.referrers],
        link=f"https://t.me/{settings.APP_TELEGRAM_BOT_NAME}?start={current_user.telegram_id}",
    )
