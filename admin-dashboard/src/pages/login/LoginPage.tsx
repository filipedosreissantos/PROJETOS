import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sparkles, Eye, EyeOff, Zap, Shield, BarChart3 } from 'lucide-react'
import { useAuth } from '@/features/auth/AuthContext'
import { loginSchema, type LoginFormData } from '@/lib/schemas'
import { Button, Input } from '@/components/ui'

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@demo.com',
      password: '123456',
    },
  })

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/app'

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null)
      await login(data)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] animate-float rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] animate-float rounded-full bg-pink-600/20 blur-[120px]" style={{ animationDelay: '2s' }} />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 animate-float rounded-full bg-cyan-500/10 blur-[100px]" style={{ animationDelay: '4s' }} />
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="relative z-10 flex w-full max-w-5xl items-center gap-20">
        {/* Left side - Branding */}
        <div className="hidden flex-1 lg:block">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              AdminPro
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Gerencie seu negócio com 
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"> poder e elegância</span>
          </h1>
          <p className="text-lg text-slate-400 mb-8">
            Dashboard administrativo moderno com análises em tempo real, gestão de usuários e controle total de produtos.
          </p>
          
          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-slate-300">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20">
                <BarChart3 className="h-5 w-5 text-purple-400" />
              </div>
              <span>Métricas e analytics em tempo real</span>
            </div>
            <div className="flex items-center gap-4 text-slate-300">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10 border border-pink-500/20">
                <Shield className="h-5 w-5 text-pink-400" />
              </div>
              <span>Controle de acesso e permissões</span>
            </div>
            <div className="flex items-center gap-4 text-slate-300">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <Zap className="h-5 w-5 text-cyan-400" />
              </div>
              <span>Interface rápida e responsiva</span>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full max-w-md">
          <div className="glass rounded-2xl p-8 border border-white/10 shadow-2xl">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="lg:hidden mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30">
                <Sparkles className="h-8 w-8 text-white" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-bold text-white">Bem-vindo de volta</h2>
              <p className="mt-2 text-sm text-slate-400">
                Entre com suas credenciais para acessar o painel
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <div
                  className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <Input
                label="Email"
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />

              <div className="relative">
                <Input
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••"
                  autoComplete="current-password"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Entrar
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 rounded-lg bg-slate-800/50 border border-slate-700/50 p-4">
              <p className="text-sm font-medium text-slate-300">Credenciais de demo:</p>
              <p className="mt-1 text-sm text-slate-400">
                Email: <code className="rounded bg-slate-700/50 px-1.5 py-0.5 text-purple-400">admin@demo.com</code>
              </p>
              <p className="text-sm text-slate-400">
                Senha: <code className="rounded bg-slate-700/50 px-1.5 py-0.5 text-purple-400">123456</code>
              </p>
            </div>
          </div>
          
          {/* Footer */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Desenvolvido com React, TypeScript e Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  )
}
