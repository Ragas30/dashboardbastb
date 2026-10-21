'use client'

import { useEffect, useState } from 'react'
import { useBastbListStore } from '@/stores/bastb-list-store'
import { BastbModal } from './bastb-modal'
import type { Bastb } from '@/features/bastbs/types/bastb-types'

export function BastbListClient({ initialItems }: { initialItems: Bastb[] }) {
  const search = useBastbListStore((state) => state.search)
  const setSearch = useBastbListStore((state) => state.setSearch)
  const [items, setItems] = useState(initialItems)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { setItems(initialItems) }, [initialItems])

  async function applySearch(event: React.FormEvent) {
    event.preventDefault(); setLoading(true); setError('')
    try {
      const response = await fetch(`/api/bastb/list?search=${encodeURIComponent(search)}`, { cache: 'no-store' })
      if (!response.ok) throw new Error()
      const result = await response.json() as { items: Bastb[] }
      setItems(result.items.map((item) => ({ ...item, bastbDate: new Date(item.bastbDate), createdAt: new Date(item.createdAt), updatedAt: new Date(item.updatedAt) })))
    } catch { setError('Terjadi kesalahan pada sistem. Silakan coba lagi.') } finally { setLoading(false) }
  }

  return <>
    <form onSubmit={applySearch} className="mb-4 flex gap-2"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari cluster atau no unit..." className="w-full max-w-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" /><button disabled={loading} className="rounded-lg border border-slate-300 bg-white px-4 py-2 disabled:opacity-60">{loading ? 'Memuat...' : 'Cari'}</button></form>
    {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">{items.length === 0 ? <div className="p-10 text-center text-sm text-slate-500">Belum ada data BASTB.</div> : <table className="w-full min-w-[620px] text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">No</th><th className="py-3">Cluster</th><th className="py-3">No Unit</th><th className="py-3">Tanggal BASTB</th><th className="py-3">Action</th></tr></thead><tbody>{items.map((item, index) => <tr key={item.id} className="border-b border-slate-100 last:border-0"><td className="px-5 py-4 text-slate-400">{index + 1}</td><td className="font-medium">{item.cluster}</td><td>{item.noUnit}</td><td>{item.bastbDate.toLocaleDateString('id-ID')}</td><td><BastbModal item={item} /></td></tr>)}</tbody></table>}</div>
  </>
}
