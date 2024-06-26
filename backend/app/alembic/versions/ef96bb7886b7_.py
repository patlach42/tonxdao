"""empty message

Revision ID: ef96bb7886b7
Revises: f356527a5191
Create Date: 2024-06-18 17:46:19.186253

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = 'ef96bb7886b7'
down_revision = 'f356527a5191'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('referee_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'user', 'user', ['referee_id'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'user', type_='foreignkey')
    op.drop_column('user', 'referee_id')
    # ### end Alembic commands ###
