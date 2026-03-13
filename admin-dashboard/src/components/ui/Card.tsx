import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn(
      'rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-6',
      'shadow-xl shadow-black/10',
      className
    )}>
      {children}
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  gradient?: 'purple' | 'pink' | 'cyan' | 'emerald'
}

const gradients = {
  purple: 'from-purple-600 to-purple-400',
  pink: 'from-pink-600 to-pink-400',
  cyan: 'from-cyan-600 to-cyan-400',
  emerald: 'from-emerald-600 to-emerald-400',
}

const glows = {
  purple: 'shadow-purple-500/30',
  pink: 'shadow-pink-500/30',
  cyan: 'shadow-cyan-500/30',
  emerald: 'shadow-emerald-500/30',
}

export function MetricCard({ title, value, icon, trend, gradient = 'purple' }: MetricCardProps) {
  return (
    <Card className="relative overflow-hidden group hover:border-white/20 transition-all duration-300">
      {/* Background glow */}
      <div className={cn(
        'absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20 transition-opacity duration-300 group-hover:opacity-40',
        gradient === 'purple' && 'bg-purple-600',
        gradient === 'pink' && 'bg-pink-600',
        gradient === 'cyan' && 'bg-cyan-600',
        gradient === 'emerald' && 'bg-emerald-600',
      )} />
      
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
                  trend.isPositive 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-red-500/20 text-red-400'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-slate-500">vs mês anterior</span>
            </div>
          )}
        </div>
        <div className={cn(
          'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-transform duration-300 group-hover:scale-110',
          gradients[gradient],
          glows[gradient]
        )}>
          {icon}
        </div>
      </div>
    </Card>
  )
}
