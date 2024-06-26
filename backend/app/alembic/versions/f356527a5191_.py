"""empty message

Revision ID: f356527a5191
Revises: 0b71e617a3aa
Create Date: 2024-05-28 12:22:09.878590

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = 'f356527a5191'
down_revision = '0b71e617a3aa'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('coins', sa.Integer(), nullable=False, default=0))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user', 'coins')
    # ### end Alembic commands ###
