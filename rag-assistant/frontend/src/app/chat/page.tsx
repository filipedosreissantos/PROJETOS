'use client'

import { useState, useRef, useEffect, FormEvent } from 'react'
import Link from 'next/link'
import {
  Send,
  ArrowLeft,
  FileText,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react'
import { sendChatMessage } from '@/lib/api'
import type { ChatMessage, Citation } from '@/types'

function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await sendChatMessage(userMessage.content)

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: response.answer,
        citations: response.citations,
        confidence: response.confidence,
        metrics: response.metrics,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente novamente.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const renderCitations = (citations: Citation[]) => {
    return (
      <div className="mt-4 space-y-2">
        <p className="text-sm font-medium text-gray-700">Fontes:</p>
        <div className="flex flex-wrap gap-2">
          {citations.map((citation) => (
            <button
              key={citation.id}
              onClick={() => setSelectedCitation(citation)}
              className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-lg hover:bg-blue-100 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              [{citation.id}] {citation.document_title} - p.{citation.page}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const renderMetrics = (message: ChatMessage) => {
    if (!message.metrics) return null

    return (
      <div className="mt-3 pt-3 border-t border-gray-200 flex flex-wrap gap-4 text-xs text-gray-500">
        <span className="inline-flex items-center">
          <Clock className="w-3.5 h-3.5 mr-1" />
          {message.metrics.latency_ms_total.toFixed(0)}ms
        </span>
        <span className="inline-flex items-center">
          <DollarSign className="w-3.5 h-3.5 mr-1" />
          ${message.metrics.cost_usd_estimated.toFixed(5)}
        </span>
        {message.confidence && (
          <span className="inline-flex items-center">
            {message.confidence.should_abstain ? (
              <>
                <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-500" />
                Confiança baixa
              </>
            ) : (
              <>
                <CheckCircle className="w-3.5 h-3.5 mr-1 text-green-500" />
                Confiança: {(message.confidence.top1_similarity * 100).toFixed(1)}%
              </>
            )}
          </span>
        )}
      </div>
    )
  }

  return (
    <main className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">
              RAG Assistant - Chat
            </h1>
          </div>
          <Link
            href="/login"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Área Admin
          </Link>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Faça uma pergunta
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Digite sua pergunta sobre os documentos carregados. O assistente
                responderá com base nas informações encontradas, incluindo citações.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message ${
                message.role === 'user'
                  ? 'chat-message-user'
                  : 'chat-message-assistant'
              }`}
            >
              <div className="flex items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {message.role === 'user' ? 'Você' : 'Assistente'}
                  </p>
                  <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap">
                    {message.content}
                  </div>

                  {message.citations && message.citations.length > 0 &&
                    renderCitations(message.citations)}

                  {message.role === 'assistant' && renderMetrics(message)}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-message chat-message-assistant">
              <div className="flex items-center text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Processando...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Citation Modal */}
      {selectedCitation && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedCitation(null)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedCitation.document_title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Página {selectedCitation.page} • Similaridade:{' '}
                    {(selectedCitation.similarity * 100).toFixed(1)}%
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCitation(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedCitation.snippet}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
