import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { usersApi } from '@/services/api'
import { userSchema, type UserFormData } from '@/lib/schemas'
import type { User } from '@/lib/types'
import { Modal, Button, Input, Select } from '@/components/ui'

interface UserFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  user: User | null
}

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
]

const statusOptions = [
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
]

export function UserFormModal({ isOpen, onClose, onSuccess, user }: UserFormModalProps) {
  const isEditing = !!user

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'viewer',
      status: 'active',
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (user) {
        reset({
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        })
      } else {
        reset({
          name: '',
          email: '',
          role: 'viewer',
          status: 'active',
        })
      }
    }
  }, [isOpen, user, reset])

  const createMutation = useMutation({
    mutationFn: (data: UserFormData) =>
      usersApi.create({
        ...data,
        createdAt: new Date().toISOString().split('T')[0],
      }),
    onSuccess,
  })

  const updateMutation = useMutation({
    mutationFn: (data: UserFormData) => usersApi.update(user!.id, data),
    onSuccess,
  })

  const mutation = isEditing ? updateMutation : createMutation

  const onSubmit = (data: UserFormData) => {
    mutation.mutate(data)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Usuário' : 'Novo Usuário'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {mutation.error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600" role="alert">
            Ocorreu um erro. Por favor, tente novamente.
          </div>
        )}

        <Input
          label="Nome"
          placeholder="Nome completo"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="email@exemplo.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Select
          label="Cargo"
          options={roleOptions}
          error={errors.role?.message}
          {...register('role')}
        />

        <Select
          label="Status"
          options={statusOptions}
          error={errors.status?.message}
          {...register('status')}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {isEditing ? 'Salvar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
