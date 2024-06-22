import datetime
from typing import Optional

import pydantic
from sqlalchemy import select, update

from app.api.deps import SessionDep, RedisDep
from app.models import User


class GameSessionData(pydantic.BaseModel):
    user_id: int
    coins: int
    energy: int
    last_energy_change: Optional[datetime.datetime]


class GameSession:
    def __init__(self, user_id: int):
        self.user_id = user_id
        self.data = GameSessionData(
            user_id=user_id,
            coins=0,
            energy=0,
            last_energy_change=None
        )

    def update_from_db(self, session: SessionDep) -> GameSessionData:
        stmt = select(User).where(User.id == self.user_id)
        user = session.execute(stmt).scalar()
        self.data = GameSessionData(
            user_id=user.id,
            coins=user.coins,
            energy=user.energy,
            last_energy_change=user.last_energy_change
        )

    def save_to_db(self, session: SessionDep) -> None:
        stmt = update(User).where(
            User.id == self.user_id
        ).values(
            coins=self.data.coins,
            energy=self.data.energy,
            last_energy_change=self.data.last_energy_change
        )
        session.execute(stmt)
        session.commit()

    async def save_to_redis(self, redis: RedisDep) -> None:
        redis_data = self.data.dict()
        redis_data['last_energy_change'] = redis_data['last_energy_change'].timestamp() if redis_data['last_energy_change'] else 0
        await redis.hset(f"user:{self.user_id}", mapping=redis_data)

    async def update_from_redis(self, redis: RedisDep) -> None:
        redis_data = await redis.hgetall(f"user:{self.user_id}")
        redis_data = {k.decode(): v.decode() for k, v in redis_data.items()}
        try:
            redis_data['last_energy_change'] = datetime.datetime(int(redis_data['last_energy_change']))
        except ValueError:
            redis_data['last_energy_change'] = 0
        self.data = GameSessionData(**redis_data)

    async def is_started(self, redis: RedisDep) -> bool:
        return await redis.hexists(f"user:{self.user_id}", "user_id")

    async def setup(self, session: SessionDep, redis: RedisDep) -> None:
        if await self.is_started(redis):
            await self.update_from_redis(redis)
        else:
            self.update_from_db(session)
            await self.save_to_redis(redis)

    async def tap(self, redis: RedisDep) -> None:
        if self.data.energy == 0:
            return
        self.data.energy -= 1
        self.data.coins += 1
        self.data.last_energy_change = datetime.datetime.now()
        await self.save_to_redis(redis)
