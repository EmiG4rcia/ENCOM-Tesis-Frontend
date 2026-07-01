import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { Sidebar } from '../components/layout/Sidebar'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage'
import { OrdersPage } from '../pages/OrdersPage'
import { CustomersPage } from '../pages/CustomersPage'
import { MenuPage } from '../pages/MenuPage'
import { TablesPage } from '../pages/TablesPage'
import { SalesPage } from '../pages/SalesPage'
import { CategoriesPage } from '../pages/CategoriesPage'
import { IngredientsPage } from '../pages/IngredientsPage'
import { StockPage } from '../pages/StockPage'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  )
}

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  )
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
        <Route path="/orders" element={<ProtectedLayout><OrdersPage /></ProtectedLayout>} />
        <Route path="/customers" element={<ProtectedLayout><CustomersPage /></ProtectedLayout>} />
        <Route path="/menu" element={<ProtectedLayout><MenuPage /></ProtectedLayout>} />
        <Route path="/categories" element={<ProtectedLayout><CategoriesPage /></ProtectedLayout>} />
        <Route path="/ingredients" element={<ProtectedLayout><IngredientsPage /></ProtectedLayout>} />
        <Route path="/tables" element={<ProtectedLayout><TablesPage /></ProtectedLayout>} />
        <Route path="/stock" element={<ProtectedLayout><StockPage /></ProtectedLayout>} />
        <Route path="/sales" element={<ProtectedLayout><SalesPage /></ProtectedLayout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}