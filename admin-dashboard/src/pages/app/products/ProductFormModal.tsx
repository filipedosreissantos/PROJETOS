import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { productsApi } from '@/services/api'
import { productSchema, type ProductFormData } from '@/lib/schemas'
import type { Product } from '@/lib/types'
import { Modal, Button, Input, Select } from '@/components/ui'

interface ProductFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  product: Product | null
}

const categoryOptions = [
  { value: 'electronics', label: 'Eletrônicos' },
  { value: 'accessories', label: 'Acessórios' },
  { value: 'components', label: 'Componentes' },
  { value: 'furniture', label: 'Móveis' },
]

const statusOptions = [
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
]

export function ProductFormModal({ isOpen, onClose, onSuccess, product }: ProductFormModalProps) {
  const isEditing = !!product

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  })

  useEffect(() => {
    if (isOpen) {
      if (product) {
        reset({
          name: product.name,
          category: product.category,
          price: product.price,
          stock: product.stock,
          status: product.status,
        })
      } else {
        reset({
          name: '',
          category: 'electronics',
          price: 0,
          stock: 0,
          status: 'active',
        })
      }
    }
  }, [isOpen, product, reset])

  const createMutation = useMutation({
    mutationFn: (data: ProductFormData) =>
      productsApi.create({
        ...data,
        createdAt: new Date().toISOString().split('T')[0],
      }),
    onSuccess,
  })

  const updateMutation = useMutation({
    mutationFn: (data: ProductFormData) => productsApi.update(product!.id, data),
    onSuccess,
  })

  const mutation = isEditing ? updateMutation : createMutation

  const onSubmit = (data: ProductFormData) => {
    mutation.mutate(data)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Produto' : 'Novo Produto'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {mutation.error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600" role="alert">
            Ocorreu um erro. Por favor, tente novamente.
          </div>
        )}

        <Input
          label="Nome"
          placeholder="Nome do produto"
          error={errors.name?.message}
          {...register('name')}
        />

        <Select
          label="Categoria"
          options={categoryOptions}
          error={errors.category?.message}
          {...register('category')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Preço (R$)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            error={errors.price?.message}
            {...register('price', { valueAsNumber: true })}
          />

          <Input
            label="Estoque"
            type="number"
            min="0"
            placeholder="0"
            error={errors.stock?.message}
            {...register('stock', { valueAsNumber: true })}
          />
        </div>

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
