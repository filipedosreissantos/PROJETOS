import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'
import { productsApi } from '@/services/api'
import type { Product } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  Button,
  Input,
  Select,
  Table,
  Pagination,
  Card,
  ConfirmDialog,
  LoadingState,
  ErrorState,
  EmptyState,
} from '@/components/ui'
import { ProductFormModal } from './ProductFormModal'

const ITEMS_PER_PAGE = 5

const categoryOptions = [
  { value: '', label: 'Todas as categorias' },
  { value: 'electronics', label: 'Eletrônicos' },
  { value: 'accessories', label: 'Acessórios' },
  { value: 'components', label: 'Componentes' },
  { value: 'furniture', label: 'Móveis' },
]

const statusOptions = [
  { value: '', label: 'Todos os status' },
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
]

const categoryLabels: Record<string, string> = {
  electronics: 'Eletrônicos',
  accessories: 'Acessórios',
  components: 'Componentes',
  furniture: 'Móveis',
}

const statusLabels: Record<string, { label: string; color: string }> = {
  active: { label: 'Ativo', color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
  inactive: { label: 'Inativo', color: 'bg-slate-500/10 text-slate-400 border border-slate-500/20' },
}

export function ProductsPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['products', page, search, categoryFilter, statusFilter],
    queryFn: () =>
      productsApi.getAll({
        page,
        limit: ITEMS_PER_PAGE,
        search: search || undefined,
        category: categoryFilter || undefined,
        status: statusFilter || undefined,
      }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['metrics'] })
      setDeletingProduct(null)
    },
  })

  const products = data?.data ?? []
  const totalPages = Math.ceil((data?.total ?? 0) / ITEMS_PER_PAGE)

  const handleOpenCreate = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const handleSuccess = () => {
    handleCloseModal()
    queryClient.invalidateQueries({ queryKey: ['products'] })
    queryClient.invalidateQueries({ queryKey: ['metrics'] })
  }

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Produto',
        render: (product: Product) => (
          <div>
            <p className="font-medium text-white">{product.name}</p>
            <p className="text-sm text-slate-400">
              {categoryLabels[product.category] || product.category}
            </p>
          </div>
        ),
      },
      {
        key: 'price',
        header: 'Preço',
        render: (product: Product) => (
          <span className="font-semibold text-emerald-400">
            {formatCurrency(product.price)}
          </span>
        ),
      },
      {
        key: 'stock',
        header: 'Estoque',
        render: (product: Product) => (
          <span
            className={
              product.stock === 0
                ? 'font-medium text-red-400'
                : product.stock < 10
                  ? 'font-medium text-amber-400'
                  : 'text-slate-300'
            }
          >
            {product.stock} un.
          </span>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        render: (product: Product) => {
          const status = statusLabels[product.status]
          return (
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}>
              {status.label}
            </span>
          )
        },
      },
      {
        key: 'createdAt',
        header: 'Criado em',
        render: (product: Product) => <span className="text-slate-400">{formatDate(product.createdAt)}</span>,
      },
      {
        key: 'actions',
        header: 'Ações',
        render: (product: Product) => (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleOpenEdit(product)
              }}
              className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-700 hover:text-white"
              aria-label={`Editar ${product.name}`}
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setDeletingProduct(product)
              }}
              className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
              aria-label={`Excluir ${product.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ),
      },
    ],
    []
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Produtos</h1>
          <p className="text-slate-400">Gerencie o catálogo de produtos</p>
        </div>
        <Button onClick={handleOpenCreate} className="flex-shrink-0">
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Novo Produto</span>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="Buscar por nome..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-11"
            />
          </div>
          <Select
            options={categoryOptions}
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value)
              setPage(1)
            }}
            className="w-full sm:w-44"
          />
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(1)
            }}
            className="w-full sm:w-40"
          />
        </div>
      </Card>

      {/* Content */}
      {isLoading ? (
        <LoadingState message="Carregando produtos..." />
      ) : error ? (
        <ErrorState
          message="Não foi possível carregar os produtos."
          onRetry={() => refetch()}
        />
      ) : products.length === 0 ? (
        <EmptyState
          title="Nenhum produto encontrado"
          message={
            search || categoryFilter || statusFilter
              ? 'Tente ajustar os filtros de busca.'
              : 'Comece cadastrando um novo produto.'
          }
          action={
            !search && !categoryFilter && !statusFilter
              ? { label: 'Criar Produto', onClick: handleOpenCreate }
              : undefined
          }
        />
      ) : (
        <>
          <Table columns={columns} data={products} keyExtractor={(product) => product.id} />
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        product={editingProduct}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={() => deletingProduct && deleteMutation.mutate(deletingProduct.id)}
        title="Excluir Produto"
        message={`Tem certeza que deseja excluir ${deletingProduct?.name}? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
