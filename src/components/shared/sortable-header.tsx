'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export function SortableHeader({ label, field }: { label: string; field: string }) {
  const router = useRouter()
  const params = useSearchParams()
  const active = params.get('sort') === field
  const direction = params.get('direction') === 'desc' ? 'desc' : 'asc'

  function sort() {
    const next = new URLSearchParams(params.toString())
    next.set('sort', field)
    next.set('direction', active && direction === 'asc' ? 'desc' : 'asc')
    router.replace(`?${next.toString()}`)
  }

  return <button type="button" onClick={sort} className="inline-flex items-center gap-1 hover:text-slate-700">{label}{active && <span aria-hidden>{direction === 'asc' ? '↑' : '↓'}</span>}</button>
}
