"""Initial migration - create tables

Revision ID: 001
Revises: 
Create Date: 2024-01-15 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from pgvector.sqlalchemy import Vector

# revision identifiers, used by Alembic.
revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Enable pgvector extension
    op.execute('CREATE EXTENSION IF NOT EXISTS vector')
    
    # Create document status enum (check if exists first)
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE documentstatus AS ENUM ('PROCESSING', 'READY', 'ERROR');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
    """)
    
    # Create documents table
    op.create_table(
        'documents',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('title', sa.String(500), nullable=False),
        sa.Column('filename', sa.String(500), nullable=False),
        sa.Column(
            'status',
            postgresql.ENUM('PROCESSING', 'READY', 'ERROR', name='documentstatus', create_type=False),
            nullable=False,
            server_default='PROCESSING'
        ),
        sa.Column('page_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('chunk_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('file_size', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('metadata', postgresql.JSONB(), nullable=False, server_default='{}'),
        sa.Column(
            'created_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=False
        ),
        sa.Column(
            'updated_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=False
        ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create chunks table
    op.create_table(
        'chunks',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('document_id', sa.Integer(), nullable=False),
        sa.Column('chunk_index', sa.Integer(), nullable=False),
        sa.Column('page', sa.Integer(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('embedding', Vector(1536), nullable=True),
        sa.Column('token_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column(
            'created_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=False
        ),
        sa.ForeignKeyConstraint(['document_id'], ['documents.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_chunks_document_id', 'chunks', ['document_id'])
    
    # Create index for vector similarity search
    op.execute('''
        CREATE INDEX IF NOT EXISTS ix_chunks_embedding 
        ON chunks 
        USING ivfflat (embedding vector_cosine_ops)
        WITH (lists = 100)
    ''')
    
    # Create chat_events table
    op.create_table(
        'chat_events',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column(
            'created_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=False
        ),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('document_ids', postgresql.JSONB(), nullable=True),
        sa.Column('answer', sa.Text(), nullable=False),
        sa.Column('should_abstain', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('citations_used', postgresql.JSONB(), nullable=False, server_default='[]'),
        sa.Column('similarities', postgresql.JSONB(), nullable=False, server_default='{}'),
        sa.Column('latencies', postgresql.JSONB(), nullable=False, server_default='{}'),
        sa.Column('token_usage', postgresql.JSONB(), nullable=False, server_default='{}'),
        sa.Column('cost_usd_estimated', sa.Float(), nullable=False, server_default='0'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_chat_events_created_at', 'chat_events', ['created_at'])


def downgrade() -> None:
    op.drop_index('ix_chat_events_created_at', table_name='chat_events')
    op.drop_table('chat_events')
    
    op.execute('DROP INDEX IF EXISTS ix_chunks_embedding')
    op.drop_index('ix_chunks_document_id', table_name='chunks')
    op.drop_table('chunks')
    
    op.drop_table('documents')
    
    op.execute('DROP TYPE IF EXISTS documentstatus')
    op.execute('DROP EXTENSION IF EXISTS vector')
