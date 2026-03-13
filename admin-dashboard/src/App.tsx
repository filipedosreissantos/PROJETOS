import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from '@/pages/login/LoginPage'
import { AppLayout } from '@/components/layout/AppLayout'
import { DashboardPage } from '@/pages/app/dashboard/DashboardPage'
import { UsersPage } from '@/pages/app/users/UsersPage'
import { ProductsPage } from '@/pages/app/products/ProductsPage'
import { ProtectedRoute } from '@/features/auth/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="products" element={<ProductsPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/app" replace />} />
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  )
}

export default App
