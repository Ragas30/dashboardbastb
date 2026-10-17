import type { ReactNode } from 'react'
import { LogoutButton } from '@/components/shared/logout-button'
import { MobileNav } from '@/components/shared/mobile-nav'
import { NavLinks } from '@/components/shared/nav-links'

export const instant = false

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-slate-50">
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-6 md:block">
      <div className="mb-10 text-xl font-semibold tracking-tight text-slate-700">Defect Monitor</div>
      <NavLinks />
      <LogoutButton />
    </aside>
    <MobileNav footer={<LogoutButton />} />
    <main className="min-h-screen md:ml-64">{children}</main>
  </div>
}
