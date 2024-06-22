import aioredis
from app.core.config import settings


redis_client = aioredis.from_url(f"redis://{settings.REDIS_SERVER}:{settings.REDIS_PORT}/{settings.REDIS_DB}")
