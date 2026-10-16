'use client'

import { useState, type ReactNode } from 'react'
import { Menu, X } from 'lucide-react'
import { NavLinks } from './nav-links'

export function MobileNav({ footer }: { footer?: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <span className="text-lg font-semibold tracking-tight text-slate-700">Defect Monitor</span>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={open}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>
      {open && (
        <div className="border-b border-slate-200 bg-white px-4 py-4">
          <NavLinks />
          {footer}
        </div>
      )}
    </div>
  )
}
