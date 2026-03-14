"""LLM service for generating chat responses."""

from openai import AsyncOpenAI
import tiktoken

from app.config import settings


SYSTEM_PROMPT = """Você é um assistente especializado em responder perguntas com base em documentos.

REGRAS IMPORTANTES:
1. Responda SOMENTE com base no contexto fornecido.
2. Se a resposta não estiver no contexto, diga claramente que não encontrou a informação nos documentos.
3. Inclua citações no formato [n] ao final de cada frase factual, onde n é o número da fonte.
4. NÃO invente informações, páginas, números, datas ou cláusulas.
5. Seja conciso e claro.
6. Use as citações para dar credibilidade às suas respostas.

O contexto está organizado em trechos numerados. Cada trecho tem um número [n] que você deve usar para citar."""


class LLMService:
    """Service for generating responses using OpenAI LLM."""

    def __init__(self):
        """Initialize OpenAI client."""
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = settings.openai_model
        self.tokenizer = tiktoken.get_encoding("cl100k_base")

    def count_tokens(self, text: str) -> int:
        """Count tokens in text."""
        return len(self.tokenizer.encode(text))

    def build_context(
        self,
        chunks: list[dict],
    ) -> str:
        """
        Build context string from retrieved chunks.

        Args:
            chunks: List of chunk dictionaries with content and metadata

        Returns:
            Formatted context string with numbered citations
        """
        context_parts: list[str] = []

        for i, chunk in enumerate(chunks, 1):
            doc_title = chunk.get("document_title", "Documento")
            page = chunk.get("page", "?")
            content = chunk.get("content", "")

            part = f"[{i}] (Fonte: {doc_title}, Página {page})\n{content}"
            context_parts.append(part)

        return "\n\n---\n\n".join(context_parts)

    async def generate_response(
        self,
        question: str,
        context: str,
    ) -> tuple[str, int, int]:
        """
        Generate response using LLM.

        Args:
            question: User question
            context: Retrieved context with citations

        Returns:
            Tuple of (response_text, input_tokens, output_tokens)
        """
        user_message = f"""CONTEXTO:
{context}

PERGUNTA:
{question}

Responda à pergunta acima usando APENAS as informações do contexto. Inclua citações [n] para cada fato mencionado."""

        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message},
        ]

        # Count input tokens (approximate)
        input_tokens = self.count_tokens(SYSTEM_PROMPT) + self.count_tokens(user_message)

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.1,  # Low temperature for factual responses
            max_tokens=2000,
        )

        answer = response.choices[0].message.content or ""
        output_tokens = self.count_tokens(answer)

        # Use actual token counts if available
        if response.usage:
            input_tokens = response.usage.prompt_tokens
            output_tokens = response.usage.completion_tokens

        return answer, input_tokens, output_tokens

    async def generate_abstain_response(self) -> str:
        """Generate the standard abstain response."""
        return (
            "Não encontrei essa informação nos documentos carregados. "
            "Você pode enviar um documento mais específico ou reformular a pergunta?"
        )

    def estimate_cost(self, input_tokens: int, output_tokens: int) -> float:
        """
        Estimate cost for LLM usage.

        Args:
            input_tokens: Number of input tokens
            output_tokens: Number of output tokens

        Returns:
            Estimated cost in USD
        """
        input_cost = (input_tokens / 1000) * settings.cost_input_per_1k
        output_cost = (output_tokens / 1000) * settings.cost_output_per_1k
        return input_cost + output_cost
