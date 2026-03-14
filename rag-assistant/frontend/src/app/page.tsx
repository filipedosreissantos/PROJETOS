import Link from 'next/link'
import { MessageSquare, FileText, BarChart3, LogIn } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            RAG Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Assistente inteligente para documentos PDF com respostas baseadas em evidências e citações precisas
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chat Inteligente
            </h3>
            <p className="text-gray-600">
              Faça perguntas sobre seus documentos e receba respostas com citações e referências de página
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Gestão de Documentos
            </h3>
            <p className="text-gray-600">
              Upload de PDFs com processamento automático, chunking inteligente e indexação vetorial
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Métricas e Análise
            </h3>
            <p className="text-gray-600">
              Acompanhe latência, custos estimados e taxa de abstinência em tempo real
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/chat"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Iniciar Chat
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Área Admin
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-24 text-center text-gray-500 text-sm">
          <p>Desenvolvido com FastAPI, Next.js e PostgreSQL + pgvector</p>
        </footer>
      </div>
    </main>
  )
}
