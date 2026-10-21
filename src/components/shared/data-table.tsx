import type { ReactNode } from 'react'

type DataTableProps = {
  children: ReactNode
  empty?: ReactNode
  className?: string
}

export function DataTable({ children, empty, className = '' }: DataTableProps) {
  return <div className={`overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children ?? empty}</div>
}

export function DataTableEmpty({ children = 'Belum ada data.' }: { children?: ReactNode }) {
  return <div className="p-10 text-center text-sm text-slate-500">{children}</div>
}

export function DataTableHead({ children }: { children: ReactNode }) {
  return <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">{children}</thead>
}
