import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'
import { usersApi } from '@/services/api'
import type { User } from '@/lib/types'
import { formatDate } from '@/lib/utils'
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
import { UserFormModal } from './UserFormModal'

const ITEMS_PER_PAGE = 5

const roleOptions = [
  { value: '', label: 'Todos os cargos' },
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
]

const statusOptions = [
  { value: '', label: 'Todos os status' },
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
]

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  editor: 'Editor',
  viewer: 'Viewer',
}

const statusLabels: Record<string, { label: string; color: string }> = {
  active: { label: 'Ativo', color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
  inactive: { label: 'Inativo', color: 'bg-slate-500/10 text-slate-400 border border-slate-500/20' },
}

export function UsersPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users', page, search, roleFilter, statusFilter],
    queryFn: () =>
      usersApi.getAll({
        page,
        limit: ITEMS_PER_PAGE,
        search: search || undefined,
        role: roleFilter || undefined,
        status: statusFilter || undefined,
      }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['metrics'] })
      setDeletingUser(null)
    },
  })

  const users = data?.data ?? []
  const totalPages = Math.ceil((data?.total ?? 0) / ITEMS_PER_PAGE)

  const handleOpenCreate = () => {
    setEditingUser(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (user: User) => {
    setEditingUser(user)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingUser(null)
  }

  const handleSuccess = () => {
    handleCloseModal()
    queryClient.invalidateQueries({ queryKey: ['users'] })
    queryClient.invalidateQueries({ queryKey: ['metrics'] })
  }

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Nome',
        render: (user: User) => (
          <div>
            <p className="font-medium text-white">{user.name}</p>
            <p className="text-sm text-slate-400">{user.email}</p>
          </div>
        ),
      },
      {
        key: 'role',
        header: 'Cargo',
        render: (user: User) => (
          <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 text-xs font-medium text-purple-400">
            {roleLabels[user.role]}
          </span>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        render: (user: User) => {
          const status = statusLabels[user.status]
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
        render: (user: User) => <span className="text-slate-400">{formatDate(user.createdAt)}</span>,
      },
      {
        key: 'actions',
        header: 'Ações',
        render: (user: User) => (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleOpenEdit(user)
              }}
              className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-700 hover:text-white"
              aria-label={`Editar ${user.name}`}
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setDeletingUser(user)
              }}
              className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
              aria-label={`Excluir ${user.name}`}
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
          <h1 className="text-2xl font-bold text-white">Usuários</h1>
          <p className="text-slate-400">Gerencie os usuários do sistema</p>
        </div>
        <Button onClick={handleOpenCreate} className="flex-shrink-0">
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Novo Usuário</span>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-11"
            />
          </div>
          <Select
            options={roleOptions}
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value)
              setPage(1)
            }}
            className="w-full sm:w-40"
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
        <LoadingState message="Carregando usuários..." />
      ) : error ? (
        <ErrorState
          message="Não foi possível carregar os usuários."
          onRetry={() => refetch()}
        />
      ) : users.length === 0 ? (
        <EmptyState
          title="Nenhum usuário encontrado"
          message={
            search || roleFilter || statusFilter
              ? 'Tente ajustar os filtros de busca.'
              : 'Comece criando um novo usuário.'
          }
          action={
            !search && !roleFilter && !statusFilter
              ? { label: 'Criar Usuário', onClick: handleOpenCreate }
              : undefined
          }
        />
      ) : (
        <>
          <Table columns={columns} data={users} keyExtractor={(user) => user.id} />
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
      <UserFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        user={editingUser}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={() => deletingUser && deleteMutation.mutate(deletingUser.id)}
        title="Excluir Usuário"
        message={`Tem certeza que deseja excluir ${deletingUser?.name}? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
