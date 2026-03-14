'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  FileText,
  BarChart3,
  MessageSquare,
  LogOut,
  Clock,
  DollarSign,
  AlertCircle,
  Hash,
  TrendingUp,
  Loader2,
} from 'lucide-react'
import { getMetrics } from '@/lib/api'
import type { MetricsData } from '@/types'

export default function MetricsPage() {
  const router = useRouter()
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const fetchMetrics = async () => {
      try {
        const data = await getMetrics()
        setMetrics(data)
      } catch (err: any) {
        if (err.status === 401) {
          router.push('/login')
        } else {
          setError('Erro ao carregar métricas')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-64 h-full bg-white border-r border-gray-200 p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-900">RAG Admin</h1>
        </div>

        <nav className="space-y-1">
          <Link
            href="/admin/docs"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <FileText className="w-5 h-5 mr-3" />
            Documentos
          </Link>
          <Link
            href="/admin/metrics"
            className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg"
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Métricas
          </Link>
          <Link
            href="/chat"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <MessageSquare className="w-5 h-5 mr-3" />
            Chat
          </Link>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Métricas</h2>
            <p className="text-gray-600">
              Acompanhe o desempenho e custos do assistente
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {metrics && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.summary.total_chats}
                  </p>
                  <p className="text-sm text-gray-500">Total de chats</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.summary.abstain_rate.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500">
                    Taxa de abstinência ({metrics.summary.abstain_count})
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.summary.avg_latency_ms.toFixed(0)}ms
                  </p>
                  <p className="text-sm text-gray-500">Latência média</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    ${metrics.summary.total_cost_usd.toFixed(4)}
                  </p>
                  <p className="text-sm text-gray-500">Custo total estimado</p>
                </div>
              </div>

              {/* Detailed Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Latency Breakdown */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Latência por Etapa
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Retrieval</span>
                        <span className="font-medium">
                          {metrics.summary.avg_latency_retrieval_ms.toFixed(0)}ms
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (metrics.summary.avg_latency_retrieval_ms /
                                metrics.summary.avg_latency_ms) *
                                100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Geração LLM</span>
                        <span className="font-medium">
                          {metrics.summary.avg_latency_generation_ms.toFixed(0)}ms
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (metrics.summary.avg_latency_generation_ms /
                                metrics.summary.avg_latency_ms) *
                                100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Token Usage */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Uso de Tokens
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Hash className="w-5 h-5 text-gray-500 mr-2" />
                        <span className="text-gray-600">Input tokens</span>
                      </div>
                      <span className="font-medium">
                        {metrics.summary.total_input_tokens.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Hash className="w-5 h-5 text-gray-500 mr-2" />
                        <span className="text-gray-600">Output tokens</span>
                      </div>
                      <span className="font-medium">
                        {metrics.summary.total_output_tokens.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-blue-700">Custo médio/chat</span>
                      </div>
                      <span className="font-medium text-blue-700">
                        ${metrics.summary.avg_cost_usd.toFixed(5)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Documents */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  <TrendingUp className="w-5 h-5 inline mr-2" />
                  Documentos Mais Consultados
                </h3>
                {metrics.top_documents.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Nenhum documento consultado ainda
                  </p>
                ) : (
                  <div className="space-y-3">
                    {metrics.top_documents.map((doc, index) => (
                      <div
                        key={doc.document_id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{doc.document_title}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {doc.query_count} consulta{doc.query_count !== 1 && 's'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
