import { useQuery } from '@tanstack/react-query'
import { Users, Package, DollarSign, ShoppingCart, ArrowRight, TrendingUp } from 'lucide-react'
import { metricsApi } from '@/services/api'
import { MetricCard, Card, LoadingState, ErrorState } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'

export function DashboardPage() {
  const {
    data: metrics,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['metrics'],
    queryFn: metricsApi.get,
  })

  if (isLoading) {
    return <LoadingState message="Carregando métricas..." />
  }

  if (error) {
    return (
      <ErrorState
        message="Não foi possível carregar as métricas."
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400">Visão geral do sistema em tempo real</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total de Usuários"
          value={metrics?.totalUsers ?? 0}
          icon={<Users className="h-6 w-6" />}
          trend={{ value: 12, isPositive: true }}
          gradient="purple"
        />
        <MetricCard
          title="Usuários Ativos"
          value={metrics?.activeUsers ?? 0}
          icon={<Users className="h-6 w-6" />}
          trend={{ value: 8, isPositive: true }}
          gradient="pink"
        />
        <MetricCard
          title="Total de Produtos"
          value={metrics?.totalProducts ?? 0}
          icon={<Package className="h-6 w-6" />}
          trend={{ value: 5, isPositive: true }}
          gradient="cyan"
        />
        <MetricCard
          title="Receita Total"
          value={formatCurrency(metrics?.totalRevenue ?? 0)}
          icon={<DollarSign className="h-6 w-6" />}
          trend={{ value: 23, isPositive: true }}
          gradient="emerald"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="group">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Resumo de Vendas</h2>
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="mt-6 flex items-center gap-4">
            <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 p-4 border border-emerald-500/20">
              <ShoppingCart className="h-7 w-7 text-emerald-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{metrics?.ordersToday ?? 0}</p>
              <p className="text-sm text-slate-400">Pedidos realizados hoje</p>
            </div>
          </div>
        </Card>

        <Card className="group">
          <h2 className="text-lg font-semibold text-white">Status dos Produtos</h2>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Produtos ativos</span>
              <span className="font-semibold text-white">{metrics?.activeProducts ?? 0}</span>
            </div>
            <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{
                  width: `${((metrics?.activeProducts ?? 0) / (metrics?.totalProducts ?? 1)) * 100}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Inativos: {(metrics?.totalProducts ?? 0) - (metrics?.activeProducts ?? 0)}</span>
              <span>Total: {metrics?.totalProducts ?? 0}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-lg font-semibold text-white">Ações Rápidas</h2>
        <p className="mt-1 text-sm text-slate-400">
          Gerencie os recursos do sistema através do menu lateral ou pelos atalhos abaixo.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <a
            href="/app/users"
            className="group flex items-center justify-between rounded-xl bg-slate-800/50 border border-slate-700/50 p-5 transition-all hover:border-purple-500/30 hover:bg-slate-800"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-3 border border-purple-500/20 group-hover:border-purple-500/40 transition-colors">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Gerenciar Usuários</p>
                <p className="text-sm text-slate-400">Criar, editar e remover</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
          </a>
          <a
            href="/app/products"
            className="group flex items-center justify-between rounded-xl bg-slate-800/50 border border-slate-700/50 p-5 transition-all hover:border-cyan-500/30 hover:bg-slate-800"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 p-3 border border-cyan-500/20 group-hover:border-cyan-500/40 transition-colors">
                <Package className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Gerenciar Produtos</p>
                <p className="text-sm text-slate-400">Controle de estoque</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
          </a>
        </div>
      </Card>
    </div>
  )
}
