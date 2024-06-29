import time
from enum import Enum
from typing import Any

import pydantic
from fastapi import APIRouter

from app.api.deps import CurrentUser, SessionDep, RedisDep
from app.core.config import settings
from app.models import User, DEFAULT_ENERGY

router = APIRouter()


class BoostEnum(Enum):
    energy = "energy"


class BoostRequest(pydantic.BaseModel):
    slug: BoostEnum


class BoostResponse(pydantic.BaseModel):
    slug: BoostEnum


@router.post("/boost")
async def boost(current_user: CurrentUser, redis: RedisDep, session: SessionDep, request: BoostRequest) -> BoostResponse:
    user_id = current_user.id
    if request.slug == BoostEnum.energy:
        await redis.hincrby(f"user:{user_id}", "coins", 1)
        await redis.hset(f"user:{user_id}", "last_energy_change", time.time() - DEFAULT_ENERGY)
        await redis.hset(f"user:{user_id}", "energy", DEFAULT_ENERGY)
        return BoostResponse(
            slug=BoostEnum.energy
        )
    return BoostResponse(
        slug=BoostEnum.energy
    )
