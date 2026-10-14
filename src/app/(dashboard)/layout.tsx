import Link from 'next/link'
import type { ReactNode } from 'react'
import { LogoutButton } from '@/components/shared/logout-button'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-slate-50">
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-6 md:block">
      <div className="mb-10 text-xl font-bold text-slate-900">Defect Monitor</div>
      <nav className="space-y-2 text-sm font-medium">
        <Link className="block rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100" href="/dashboard">Dashboard</Link>
        <Link className="block rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100" href="/defects">List Defect</Link>
        <Link className="block rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100" href="/defects/new">Tambah Defect</Link>
        <Link className="block rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100" href="/master/pics">Master PIC</Link>
        <LogoutButton />
      </nav>
    </aside>
    <main className="min-h-screen md:ml-64">{children}</main>
  </div>
}
