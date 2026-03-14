// Types for the RAG Assistant frontend

export interface Document {
  id: number
  title: string
  filename: string
  status: 'PROCESSING' | 'READY' | 'ERROR'
  page_count: number
  chunk_count: number
  file_size: number
  error_message?: string
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface Citation {
  id: number
  document_id: number
  document_title: string
  filename: string
  page: number
  snippet: string
  similarity: number
}

export interface Confidence {
  top1_similarity: number
  top2_similarity?: number
  gap?: number
  coverage: number
  should_abstain: boolean
}

export interface Metrics {
  latency_ms_total: number
  latency_ms_retrieval: number
  latency_ms_generation: number
  input_tokens: number
  output_tokens: number
  cost_usd_estimated: number
}

export interface ChatResponse {
  answer: string
  citations: Citation[]
  confidence: Confidence
  metrics: Metrics
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  citations?: Citation[]
  confidence?: Confidence
  metrics?: Metrics
  timestamp: Date
}

export interface MetricsSummary {
  total_chats: number
  abstain_count: number
  abstain_rate: number
  avg_latency_ms: number
  avg_latency_retrieval_ms: number
  avg_latency_generation_ms: number
  total_cost_usd: number
  avg_cost_usd: number
  total_input_tokens: number
  total_output_tokens: number
}

export interface TopDocument {
  document_id: number
  document_title: string
  query_count: number
}

export interface MetricsData {
  summary: MetricsSummary
  top_documents: TopDocument[]
}
