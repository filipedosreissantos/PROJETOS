import { Loader2, AlertCircle, Inbox, RefreshCw } from 'lucide-react'
import { Button } from './Button'

export function LoadingState({ message = 'Carregando...' }: { message?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16"
      role="status"
      aria-live="polite"
    >
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-purple-500/20" />
        <Loader2 className="relative h-10 w-10 animate-spin text-purple-500" aria-hidden="true" />
      </div>
      <p className="mt-6 text-sm text-slate-400">{message}</p>
    </div>
  )
}

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  message = 'Ocorreu um erro ao carregar os dados.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16"
      role="alert"
    >
      <div className="rounded-2xl bg-red-500/10 p-4 border border-red-500/20">
        <AlertCircle className="h-8 w-8 text-red-400" aria-hidden="true" />
      </div>
      <p className="mt-6 text-sm text-slate-400">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="mt-6">
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Tentar novamente
        </Button>
      )}
    </div>
  )
}

interface EmptyStateProps {
  title?: string
  message?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  title = 'Nenhum item encontrado',
  message = 'Não há dados para exibir no momento.',
  action,
}: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16"
      role="status"
    >
      <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
        <Inbox className="h-8 w-8 text-slate-500" aria-hidden="true" />
      </div>
      <h3 className="mt-6 text-sm font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{message}</p>
      {action && (
        <Button onClick={action.onClick} className="mt-6">
          {action.label}
        </Button>
      )}
    </div>
  )
}
