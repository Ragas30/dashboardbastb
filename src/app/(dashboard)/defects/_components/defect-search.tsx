'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDefectListStore } from '@/stores/defect-list-store'

export function DefectSearch({ initialSearch }: { initialSearch?: string }) {
  const router = useRouter()
  const search = useDefectListStore((state) => state.search)
  const setSearch = useDefectListStore((state) => state.setSearch)
  useEffect(() => { setSearch(initialSearch ?? '') }, [initialSearch, setSearch])
  return <form onSubmit={(event) => { event.preventDefault(); const query = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ''; router.push(`/defects${query}`) }} className="mb-4 flex gap-2"><input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full max-w-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" placeholder="Cari project, unit, PIC..." /><button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm">Cari</button></form>
}
