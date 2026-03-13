import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Package, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/app/users', icon: Users, label: 'Usuários' },
  { to: '/app/products', icon: Package, label: 'Produtos' },
]

export function Sidebar() {
  return (
    <aside className="flex w-72 flex-col border-r border-white/5 bg-slate-900/50 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex h-20 items-center gap-3 border-b border-white/5 px-6">
        <div className="relative">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-500/30">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
        </div>
        <div>
          <div className="flex items-baseline gap-0.5">
            <span className="text-lg font-bold text-white">Admin</span>
            <span className="text-lg font-light text-purple-400">Panel</span>
          </div>
          <p className="text-xs text-slate-500">Enterprise Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4" role="navigation" aria-label="Menu principal">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Menu Principal
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300',
                isActive
                  ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white shadow-lg shadow-purple-500/10 border border-purple-500/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-300',
                  isActive 
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-500/30' 
                    : 'bg-slate-800 group-hover:bg-slate-700'
                )}>
                  <item.icon className={cn('h-5 w-5', isActive ? 'text-white' : 'text-slate-400 group-hover:text-white')} aria-hidden="true" />
                </div>
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-white/5 p-4">
        <div className="rounded-xl bg-gradient-to-r from-purple-600/10 to-pink-600/10 p-4 border border-purple-500/20">
          <p className="text-sm font-medium text-white">Pro Features</p>
          <p className="mt-1 text-xs text-slate-400">Desbloqueie recursos avançados</p>
          <button className="mt-3 w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:shadow-lg hover:shadow-purple-500/30">
            Upgrade Agora
          </button>
        </div>
      </div>
    </aside>
  )
}
