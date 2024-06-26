"""Add column telegram_id to User model

Revision ID: e8b2504e3df0
Revises: e2412789c190
Create Date: 2024-05-27 08:26:54.306550

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = 'e8b2504e3df0'
down_revision = 'e2412789c190'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('telegram_id', sqlmodel.sql.sqltypes.AutoString(), nullable=False))
    op.create_index(op.f('ix_user_telegram_id'), 'user', ['telegram_id'], unique=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_user_telegram_id'), table_name='user')
    op.drop_column('user', 'telegram_id')
    # ### end Alembic commands ###
