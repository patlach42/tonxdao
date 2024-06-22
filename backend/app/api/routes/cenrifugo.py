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
    user_id = int(data.user)
    game_session = GameSession(user_id)
    await game_session.setup(session, redis)
    match data.method:
        case CentrifugoRpcMethod.on_connected:
            pass
        case CentrifugoRpcMethod.tap:
            await game_session.tap(redis)
    return {}


@router.post("/pub")
async def pub(session: SessionDep, redis: RedisDep, data: dict) -> dict:
    # print(data)
    user_id = int(data['user'])
    game_session = GameSession(user_id)
    energy_per_second = 1
    last_energy_change = float(await redis.hget(f"user:{user_id}", "last_energy_change"))
    last_energy = float(await redis.hget(f"user:{user_id}", "energy"))
    calculated_energy = round(time.time() - last_energy_change) // energy_per_second
    total_energy = last_energy + calculated_energy

    # if total_energy == 0:
    #     return {}
    result_energy = min(total_energy, 500) if total_energy > 0 else 0
    print(result_energy)

    await redis.hincrby(f"user:{user_id}", "coins", 1)
    await redis.hset(f"user:{user_id}", "last_energy_change", time.time())
    await redis.hset(f"user:{user_id}", "energy", result_energy - 1)

    # await game_session.setup(session, redis)
    # await game_session.tap(redis)

    # match data.method:
    #     case CentrifugoRpcMethod.on_connected:
    #         pass
    #     case CentrifugoRpcMethod.tap:
    #         await game_session.tap(redis)
    return {}
