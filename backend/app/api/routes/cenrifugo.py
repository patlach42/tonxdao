from fastapi import APIRouter
from sqlalchemy import select, update

from app.api.deps import SessionDep
from app.models import User

router = APIRouter()


@router.post("/rpc")
def rpc(session: SessionDep, data: dict) -> dict:
    user_id = int(data['user'])
    stmt = update(User).where(User.id == user_id).values(coins=User.coins + 1)
    session.execute(stmt)
    session.commit()
    return {}
