import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Column<T> {
  key: keyof T | string
  header: string
  render?: (item: T) => ReactNode
  className?: string
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string | number
  onRowClick?: (item: T) => void
}

export function Table<T>({ columns, data = [], keyExtractor, onRowClick }: TableProps<T>) {
  const items = Array.isArray(data) ? data : []
  
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-white/10 bg-white/5">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn(
                  'px-6 py-4 font-semibold text-slate-300 uppercase text-xs tracking-wider',
                  column.className
                )}
                scope="col"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {items.map((item) => (
            <tr
              key={keyExtractor(item)}
              className={cn(
                'transition-all duration-300',
                onRowClick && 'cursor-pointer hover:bg-white/5'
              )}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className={cn('px-6 py-4 text-slate-300', column.className)}
                >
                  {column.render
                    ? column.render(item)
                    : String(item[column.key as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visiblePages = pages.filter(
    (page) =>
      page === 1 ||
      page === totalPages ||
      Math.abs(page - currentPage) <= 1
  )

  return (
    <nav className="flex items-center justify-center gap-2 mt-6" aria-label="Paginação">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-xl px-4 py-2 text-sm font-medium text-slate-400 transition-all hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
        aria-label="Página anterior"
      >
        Anterior
      </button>

      {visiblePages.map((page, index) => {
        const prevPage = visiblePages[index - 1]
        const showEllipsis = prevPage && page - prevPage > 1

        return (
          <span key={page} className="flex items-center">
            {showEllipsis && (
              <span className="px-2 text-slate-500">...</span>
            )}
            <button
              onClick={() => onPageChange(page)}
              className={cn(
                'rounded-xl px-4 py-2 text-sm font-medium transition-all',
                currentPage === page
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                  : 'text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
              )}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          </span>
        )
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-xl px-4 py-2 text-sm font-medium text-slate-400 transition-all hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
        aria-label="Próxima página"
      >
        Próximo
      </button>
    </nav>
  )
}
