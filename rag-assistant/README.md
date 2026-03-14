# RAG Assistant

Um assistente inteligente para documentos PDF com **Retrieval-Augmented Generation (RAG)**, citações precisas e detecção de baixa confiança.

![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-blue.svg)
![pgvector](https://img.shields.io/badge/pgvector-0.5+-purple.svg)

## Visão Geral

O RAG Assistant permite:

- 📄 **Upload de PDFs** com processamento assíncrono
- 🔍 **Busca semântica** usando embeddings vetoriais
- 💬 **Chat inteligente** com respostas baseadas em evidências
- 📎 **Citações precisas** com referência a documento e página
- ⚠️ **Detecção de baixa confiança** com resposta "não sei"
- 📊 **Métricas** de latência, custo e uso

## Arquitetura

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Frontend      │────▶│   Backend       │────▶│   PostgreSQL    │
│   (Next.js)     │     │   (FastAPI)     │     │   + pgvector    │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   OpenAI API    │
                        │  (Embeddings    │
                        │    + LLM)       │
                        └─────────────────┘
```

### Fluxo de Ingestão

1. Upload do PDF via API
2. Extração de texto preservando páginas
3. Normalização e chunking configurável
4. Geração de embeddings (OpenAI)
5. Armazenamento no PostgreSQL com pgvector

### Fluxo de Chat (RAG)

1. Embedding da pergunta do usuário
2. Busca por similaridade vetorial (top-k chunks)
3. Montagem do contexto com citações numeradas
4. Geração de resposta com LLM
5. Retorno com citações, confiança e métricas

## Estrutura do Projeto

```
rag-assistant/
├── backend/
│   ├── app/
│   │   ├── api/           # Endpoints REST
│   │   ├── models/        # Modelos SQLAlchemy
│   │   ├── schemas/       # Schemas Pydantic
│   │   ├── services/      # Lógica de negócio
│   │   ├── config.py      # Configurações
│   │   ├── database.py    # Conexão DB
│   │   └── main.py        # Aplicação FastAPI
│   ├── alembic/           # Migrações
│   ├── tests/             # Testes pytest
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/           # Páginas Next.js
│   │   ├── lib/           # API client
│   │   └── types/         # TypeScript types
│   ├── Dockerfile
│   └── package.json
├── data/
│   └── eval_questions.jsonl
├── scripts/
│   └── eval.py            # Script de avaliação
├── docker-compose.yml
├── .env.example
└── README.md
```

## Como Rodar

### Pré-requisitos

- Docker e Docker Compose
- Chave de API da OpenAI

### 1. Clone e Configure

```bash
# Clone o repositório
git clone <repo-url>
cd rag-assistant

# Copie o arquivo de ambiente
cp .env.example .env

# Edite o .env e adicione sua chave OpenAI
# OPENAI_API_KEY=sk-your-key-here
```

### 2. Suba os Containers

```bash
docker compose up -d
```

Isso irá iniciar:
- PostgreSQL com pgvector na porta `5432`
- Backend FastAPI na porta `8000`
- Frontend Next.js na porta `3000`

### 3. Acesse a Aplicação

- **Chat**: http://localhost:3000/chat
- **Admin**: http://localhost:3000/login (senha padrão: `admin123`)
- **API Docs**: http://localhost:8000/docs

## Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `DATABASE_URL` | URL de conexão PostgreSQL | `postgresql://...` |
| `ADMIN_PASSWORD` | Senha do admin | `admin123` |
| `OPENAI_API_KEY` | Chave API OpenAI | (obrigatório) |
| `OPENAI_MODEL` | Modelo LLM | `gpt-4o-mini` |
| `OPENAI_EMBEDDING_MODEL` | Modelo de embeddings | `text-embedding-3-small` |
| `CHUNK_SIZE` | Tamanho dos chunks (chars) | `1000` |
| `CHUNK_OVERLAP` | Overlap entre chunks | `200` |
| `TOP_K` | Número de chunks retornados | `5` |
| `SIMILARITY_THRESHOLD` | Limiar para abstinência | `0.3` |

## Como Usar

### 1. Upload de Documentos

**Via Interface:**
1. Acesse http://localhost:3000/login
2. Entre com a senha admin
3. Vá para "Documentos" e clique em "Upload PDF"
4. Aguarde o status mudar para "Pronto"

**Via API (curl):**
```bash
# Login para obter token
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password": "admin123"}' | jq -r '.access_token')

# Upload do PDF
curl -X POST http://localhost:8000/api/documents \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@documento.pdf" \
  -F "title=Meu Documento"
```

### 2. Chat

**Via Interface:**
1. Acesse http://localhost:3000/chat
2. Digite sua pergunta
3. Veja a resposta com citações

**Via API (curl):**
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Qual é o objetivo principal do documento?"
  }'
```

### 3. Exemplos de Perguntas

**Perguntas que devem ser respondidas:**
- "Qual é o objetivo principal do documento?"
- "Quais são as conclusões apresentadas?"
- "Quem são os autores?"

**Perguntas que devem resultar em "não sei":**
- "Qual é o preço do Bitcoin hoje?"
- "Quem é o presidente dos EUA?"
- "Qual a previsão do tempo?"

## Resposta do Chat

```json
{
  "answer": "O objetivo principal do documento é... [1] [2]",
  "citations": [
    {
      "id": 1,
      "document_title": "Manual de Operações",
      "page": 5,
      "snippet": "Este documento tem como objetivo...",
      "similarity": 0.89
    }
  ],
  "confidence": {
    "top1_similarity": 0.89,
    "top2_similarity": 0.82,
    "coverage": 3,
    "should_abstain": false
  },
  "metrics": {
    "latency_ms_total": 1523.45,
    "latency_ms_retrieval": 120.32,
    "latency_ms_generation": 1402.13,
    "input_tokens": 1250,
    "output_tokens": 180,
    "cost_usd_estimated": 0.000295
  }
}
```

## Avaliação (Ground Truth)

O projeto inclui um script para avaliar o desempenho do sistema.

### Executar Avaliação

```bash
# Com Docker
docker compose exec backend python ../scripts/eval.py

# Localmente
cd scripts
python eval.py --api-url http://localhost:8000 --output results.csv
```

### Personalizar Perguntas

Edite o arquivo `data/eval_questions.jsonl`:

```jsonl
{"question": "Sua pergunta aqui", "expected_abstain": false}
{"question": "Pergunta fora do escopo", "expected_abstain": true}
```

### Métricas de Avaliação

- **Abstention Rate**: % de perguntas que retornaram "não sei"
- **Abstention Accuracy**: % de acertos na decisão de abstinência
- **Mean Latency**: Latência média por pergunta
- **Citation Count**: Média de citações por resposta

## Testes

```bash
# Backend
cd backend
pytest tests/ -v

# Frontend (lint)
cd frontend
npm run lint
```

## API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/login` | Autenticação admin |
| GET | `/api/documents` | Listar documentos |
| POST | `/api/documents` | Upload de documento |
| DELETE | `/api/documents/{id}` | Excluir documento |
| POST | `/api/documents/{id}/reindex` | Reindexar documento |
| POST | `/api/chat` | Enviar mensagem |
| GET | `/api/metrics` | Obter métricas |

## Banco de Dados

### Tabelas

**documents**
- `id`, `title`, `filename`, `status`
- `page_count`, `chunk_count`, `file_size`
- `metadata`, `created_at`, `updated_at`

**chunks**
- `id`, `document_id`, `chunk_index`, `page`
- `content`, `embedding` (vector), `token_count`

**chat_events**
- `id`, `message`, `answer`, `should_abstain`
- `citations_used`, `similarities`, `latencies`
- `token_usage`, `cost_usd_estimated`

### Migrações

```bash
# Criar nova migração
docker compose exec backend alembic revision --autogenerate -m "descrição"

# Aplicar migrações
docker compose exec backend alembic upgrade head

# Reverter última migração
docker compose exec backend alembic downgrade -1
```

## Troubleshooting

### Documento fica em "PROCESSING"

Verifique os logs do backend:
```bash
docker compose logs backend -f
```

Causas comuns:
- Chave OpenAI inválida
- PDF sem texto extraível
- Erro de conexão com DB

### Erro de conexão com DB

```bash
# Reinicie o banco
docker compose restart db

# Verifique se está rodando
docker compose ps
```

### Baixa qualidade das respostas

- Aumente `TOP_K` para buscar mais chunks
- Diminua `SIMILARITY_THRESHOLD` para ser menos restritivo
- Use um modelo LLM mais capaz

## Licença

MIT License

## Contribuição

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/melhoria`)
3. Commit suas mudanças (`git commit -am 'Adiciona feature'`)
4. Push para a branch (`git push origin feature/melhoria`)
5. Abra um Pull Request
