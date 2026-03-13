import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const userSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  role: z.enum(['admin', 'editor', 'viewer'], {
    message: 'Selecione um cargo',
  }),
  status: z.enum(['active', 'inactive'], {
    message: 'Selecione um status',
  }),
})

export type UserFormData = z.infer<typeof userSchema>

export const productSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  price: z.number().positive('Preço deve ser maior que zero'),
  stock: z.number().int().min(0, 'Estoque não pode ser negativo'),
  status: z.enum(['active', 'inactive'], {
    message: 'Selecione um status',
  }),
})

export type ProductFormData = z.infer<typeof productSchema>
