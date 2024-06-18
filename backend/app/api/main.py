from fastapi import APIRouter

from app.api.routes import login, cenrifugo, referrers

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(cenrifugo.router, tags=["cenrifugo"])
api_router.include_router(referrers.router, tags=["referrers"])
