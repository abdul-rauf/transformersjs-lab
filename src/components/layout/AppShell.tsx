import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'

export function AppShell() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="app-main md:ml-64">
        <Header />
        <main className="app-content px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
