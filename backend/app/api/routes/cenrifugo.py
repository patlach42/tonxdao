import time
from enum import Enum

import pydantic
from fastapi import APIRouter

from app.api.deps import SessionDep, RedisDep
from app.game import GameSession

router = APIRouter()


class CentrifugoRpcMethod(Enum):
    on_connected = "on_connected"
    tap = "tap"


class CentrifugoRpc(pydantic.BaseModel):
    user: str
    method: CentrifugoRpcMethod
    data: dict


@router.post("/rpc")
async def rpc(session: SessionDep, redis: RedisDep, data: CentrifugoRpc) -> dict:
    # user_id = int(data.user)
    # game_session = GameSession(user_id)
    return {}


ENERGY_PER_SECOND = 1
MAX_ENERGY = 6000


async def get_user_energy(redis: RedisDep, user_id):
    last_energy_change = float(await redis.hget(f"user:{user_id}", "last_energy_change"))
    last_energy = float(await redis.hget(f"user:{user_id}", "energy"))
    energy_per_second = ENERGY_PER_SECOND
    max_energy = MAX_ENERGY
    calculated_energy = (time.time() - last_energy_change) // energy_per_second
    total_energy = last_energy + calculated_energy
    result_energy = min(total_energy, max_energy) if total_energy > 0 else 0
    return result_energy


@router.post("/pub")
async def pub(session: SessionDep, redis: RedisDep, data: dict) -> dict:
    # print(data)
    user_id = int(data['user'])
    result_energy = await get_user_energy(redis, user_id)

    if result_energy < -1:
        return {}

    # await redis.hset(f"user:{user_id}", "coins", 0)
    await redis.hincrby(f"user:{user_id}", "coins", 1)
    await redis.hset(f"user:{user_id}", "last_energy_change", time.time())
    await redis.hset(f"user:{user_id}", "energy", result_energy - 1)
    return {}
