'use client'

import { useEffect, useMemo, useState } from 'react'
import { useBastbListStore } from '@/stores/bastb-list-store'
import { BastbModal } from './bastb-modal'
import type { Bastb } from '@/features/bastbs/types/bastb-types'
import { DataTable, DataTableEmpty, DataTableHead } from '@/components/shared/data-table'

export function BastbListClient({ initialItems }: { initialItems: Bastb[] }) {
  const search = useBastbListStore((state) => state.search)
  const page = useBastbListStore((state) => state.page)
  const setSearch = useBastbListStore((state) => state.setSearch)
  const setPage = useBastbListStore((state) => state.setPage)
  const [items, setItems] = useState(initialItems)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sort, setSort] = useState<{ key: 'cluster' | 'noUnit' | 'bastbDate'; direction: 'asc' | 'desc' }>({ key: 'bastbDate', direction: 'desc' })

  useEffect(() => { setItems(initialItems) }, [initialItems])

  const pageSize = 10
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const sortedItems = useMemo(() => [...items].sort((a, b) => {
    const left = sort.key === 'bastbDate' ? a.bastbDate.getTime() : a[sort.key].toLocaleLowerCase()
    const right = sort.key === 'bastbDate' ? b.bastbDate.getTime() : b[sort.key].toLocaleLowerCase()
    const result = left < right ? -1 : left > right ? 1 : 0
    return sort.direction === 'asc' ? result : -result
  }), [items, sort])
  const visibleItems = sortedItems.slice((page - 1) * pageSize, page * pageSize)

  function toggleSort(key: typeof sort.key) {
    setSort((current) => current.key === key ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' })
    setPage(1)
  }

  function sortLabel(label: string, key: typeof sort.key) {
    return <button type="button" onClick={() => toggleSort(key)} className="inline-flex items-center gap-1 hover:text-slate-700">{label}{sort.key === key && <span aria-label={sort.direction === 'asc' ? 'ascending' : 'descending'}>{sort.direction === 'asc' ? '↑' : '↓'}</span>}</button>
  }

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, setPage, totalPages])

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
    <DataTable>{items.length === 0 ? <DataTableEmpty>Belum ada data BASTB.</DataTableEmpty> : <table className="w-full min-w-[620px] text-left text-sm"><DataTableHead><tr><th className="px-5 py-3">No</th><th className="py-3">{sortLabel('Cluster', 'cluster')}</th><th className="py-3">{sortLabel('No Unit', 'noUnit')}</th><th className="py-3">{sortLabel('Tanggal BASTB', 'bastbDate')}</th><th className="py-3">Action</th></tr></DataTableHead><tbody>{visibleItems.map((item, index) => <tr key={item.id} className="border-b border-slate-100 last:border-0"><td className="px-5 py-4 text-slate-400">{(page - 1) * pageSize + index + 1}</td><td className="font-medium">{item.cluster}</td><td>{item.noUnit}</td><td>{item.bastbDate.toLocaleDateString('id-ID')}</td><td><BastbModal item={item} /></td></tr>)}</tbody></table>}</DataTable>
    {items.length > 0 && <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500"><p>Menampilkan {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, items.length)} dari {items.length} data.</p><div className="flex items-center gap-2"><button type="button" disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40">Sebelumnya</button><span>Halaman {page} dari {totalPages}</span><button type="button" disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40">Berikutnya</button></div></div>}
  </>
}
