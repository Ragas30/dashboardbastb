'use client'

import { useEffect, useMemo, useState } from 'react'
import { create } from 'zustand'
import { DEFECT_STATUSES } from '@/features/defects/domain/defect-status'
import { DEFECT_STATUS_LABELS } from '@/components/shared/defect-status-labels'
import type { DashboardData, DashboardFilterState } from '@/features/defects/types/dashboard-types'

type DashboardStore = DashboardFilterState & { setFilter: (key: keyof DashboardFilterState, value: string) => void }
const useDashboardStore = create<DashboardStore>((set) => ({
  bastbId: undefined, search: '', projectCluster: '', unit: '', picId: undefined, status: undefined, defectDateFrom: '', defectDateTo: '',
  setFilter: (key, value) => set({ [key]: value || undefined }),
}))

const cards = [['total', 'Total Defect', 'text-slate-700'], ['open', 'Open', 'text-amber-700'], ['onProgress', 'On Progress', 'text-sky-700'], ['completed', 'Completed', 'text-emerald-700']] as const

export function DashboardClient({ initialData }: { initialData: DashboardData }) {
  const filters = useDashboardStore()
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const setFilter = filters.setFilter
  const activeDefects = useMemo(() => data.defects.filter((defect) => defect.status !== 'COMPLETED').sort((a, b) => a.targetRepair.getTime() - b.targetRepair.getTime()).slice(0, 8), [data.defects])
  const usedBastbIds = new Set(data.defects.flatMap((defect) => defect.bastbId ? [defect.bastbId] : []))

  useEffect(() => {
    setData({ ...initialData, defects: initialData.defects.map((defect) => ({ ...defect, defectDate: new Date(defect.defectDate), targetRepair: new Date(defect.targetRepair), createdAt: new Date(defect.createdAt), updatedAt: new Date(defect.updatedAt) })) })
  }, [initialData])

  async function applyFilters(event: React.FormEvent) {
    event.preventDefault(); setLoading(true); setError('')
    const query = new URLSearchParams()
    for (const [key, value] of Object.entries(filters)) if (key !== 'setFilter' && value !== undefined && value !== '') query.set(key, String(value))
    try {
      const response = await fetch(`/api/dashboard?${query}`, { cache: 'no-store' })
      if (!response.ok) throw new Error()
      const next = await response.json() as DashboardData
      setData({ ...next, defects: next.defects.map((defect) => ({ ...defect, defectDate: new Date(defect.defectDate), targetRepair: new Date(defect.targetRepair), createdAt: new Date(defect.createdAt), updatedAt: new Date(defect.updatedAt) })) })
    } catch { setError('Terjadi kesalahan pada sistem. Silakan coba lagi.') } finally { setLoading(false) }
  }

  const today = new Date(); today.setHours(0, 0, 0, 0)
  return <>
    <form onSubmit={applyFilters} className="mb-6 grid gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
      <select value={filters.bastbId ?? ''} onChange={(e) => setFilter('bastbId', e.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"><option value="">Semua BASTB</option>{data.bastbs.map((item) => <option key={item.id} value={item.id}>{item.cluster} - {item.noUnit}</option>)}</select>
      <input value={filters.projectCluster ?? ''} onChange={(e) => setFilter('projectCluster', e.target.value)} placeholder="Project / Cluster" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700" />
      <input value={filters.unit ?? ''} onChange={(e) => setFilter('unit', e.target.value)} placeholder="Unit" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700" />
      <input value={filters.search ?? ''} onChange={(e) => setFilter('search', e.target.value)} placeholder="Cari project, unit, PIC..." className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700" />
      <select value={filters.picId ?? ''} onChange={(e) => setFilter('picId', e.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"><option value="">Semua PIC</option>{data.pics.filter((pic) => pic.status === 'ACTIVE').map((pic) => <option key={pic.id} value={pic.id}>{pic.name}</option>)}</select>
      <select value={filters.status ?? ''} onChange={(e) => setFilter('status', e.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"><option value="">Semua status</option>{DEFECT_STATUSES.map((value) => <option key={value} value={value}>{DEFECT_STATUS_LABELS[value]}</option>)}</select>
      <input type="date" value={filters.defectDateFrom ?? ''} onChange={(e) => setFilter('defectDateFrom', e.target.value)} aria-label="Tanggal dari" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700" />
      <input type="date" value={filters.defectDateTo ?? ''} onChange={(e) => setFilter('defectDateTo', e.target.value)} aria-label="Tanggal sampai" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700" />
      <button disabled={loading} className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">{loading ? 'Memuat...' : 'Terapkan Filter'}</button>
      {error && <p className="text-sm text-red-600 sm:col-span-2 lg:col-span-4">{error}</p>}
    </form>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([key, label, color]) => <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={key}><p className="text-sm font-medium text-slate-500">{label}</p><p className={`mt-3 text-4xl font-bold ${color}`}>{data.summary[key]}</p></div>)}</div>
    <div className="mt-4 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Total BASTB</p><p className="mt-2 text-3xl font-bold text-slate-700">{data.bastbs.length}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">BASTB Sudah Dipakai</p><p className="mt-2 text-3xl font-bold text-sky-700">{usedBastbIds.size}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">BASTB Belum Dipakai</p><p className="mt-2 text-3xl font-bold text-amber-700">{Math.max(0, data.bastbs.length - usedBastbIds.size)}</p></div></div>
    <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-4"><h2 className="font-semibold">Monitoring Defect Aktif</h2><p className="mt-1 text-sm text-slate-500">Defect Open dan On Progress dengan target repair terdekat.</p></div>{activeDefects.length === 0 ? <p className="text-sm text-slate-500">Tidak ada defect aktif.</p> : <table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-slate-200 text-xs uppercase text-slate-500"><tr><th className="py-3">Cluster</th><th className="py-3">Unit</th><th className="py-3">Total</th><th className="py-3">Status</th><th className="py-3">PIC</th><th className="py-3">Target Repair</th></tr></thead><tbody>{activeDefects.map((defect) => <tr key={defect.id} className="border-b border-slate-100 last:border-0"><td className="py-3">{defect.projectCluster}</td><td>{defect.unit}</td><td>{defect.totalDefect}</td><td>{DEFECT_STATUS_LABELS[defect.status]}</td><td>{defect.pic?.name ?? '-'}</td><td className={defect.targetRepair < today ? 'font-semibold text-red-600' : 'text-slate-600'}>{defect.targetRepair.toLocaleDateString('id-ID')}{defect.targetRepair < today ? ' · Terlambat' : ''}</td></tr>)}</tbody></table>}</div>
  </>
}
