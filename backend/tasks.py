import redis
from huey import RedisHuey, crontab
from sqlalchemy import update
from sqlmodel import Session

from app.api.deps import get_db
from app.api.routes.cenrifugo import GameSession
from app.core.config import settings
from app.core.db import engine
from app.models import User

huey = RedisHuey("tasks", url="redis://redis:6379/1")


redis_client = redis.from_url(f"redis://{settings.REDIS_SERVER}:{settings.REDIS_PORT}/{settings.REDIS_DB}")


@huey.periodic_task(crontab(minute='*/1'))
def every_minute():
    for i in redis_client.scan_iter(b'user:*'):
        all_values = {k.decode(): v.decode() for k, v in redis_client.hgetall(i).items()}
        user_id = int(all_values.get('user_id'))
        coins = int(all_values.get('coins'))
        energy = int(all_values.get('energy'))
        last_energy_change = all_values.get('last_energy_change')

        with Session(engine) as session:
            stmt = update(User).where(
                User.id == user_id
            ).values(
                coins=coins,
                energy=energy,
                # last_energy_change=last_energy_change
            )
            session.execute(stmt)
            session.commit()

        print(all_values)
    print('This task runs every_minute')
