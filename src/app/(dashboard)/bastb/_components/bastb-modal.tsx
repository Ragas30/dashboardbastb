'use client'

import { useState, useActionState } from 'react'
import { Modal } from '@/components/ui/modal'
import { createBastbAction, updateBastbAction, type BastbActionResult } from '@/app/actions/bastb-actions'
import type { Bastb } from '@/features/bastbs/types/bastb-types'
import { useToastStore } from '@/stores/toast-store'

function dateValue(value?: Date) { return value?.toISOString().slice(0, 10) ?? '' }
function Form({ item, onSuccess, onCancel }: { item?: Bastb; onSuccess: () => void; onCancel: () => void }) {
  const action = item ? updateBastbAction : createBastbAction
  const addToast = useToastStore((state) => state.add)
  const [state, formAction, pending] = useActionState<BastbActionResult, FormData>(async (_previous, data) => { const result = await action(data); if (result.ok) { addToast(item ? 'BASTB berhasil diperbarui.' : 'BASTB berhasil ditambahkan.'); onSuccess() } return result }, { ok: true })
  const input = 'mt-2 w-full rounded-lg border border-slate-300 px-3 py-2'
  return <form action={formAction} className="space-y-4">
    {item && <input type="hidden" name="id" value={item.id} />}
    <label className="block text-sm font-medium text-slate-600">Cluster<input name="cluster" required defaultValue={item?.cluster} className={input} /></label>
    <label className="block text-sm font-medium text-slate-600">No Unit<input name="noUnit" required defaultValue={item?.noUnit} className={input} /></label>
    <label className="block text-sm font-medium text-slate-600">Tanggal BASTB<input type="date" name="bastbDate" required defaultValue={dateValue(item?.bastbDate)} className={input} /></label>
    {!state.ok && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.message}</div>}
    <div className="flex justify-end gap-2"><button type="button" onClick={onCancel} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Batal</button><button disabled={pending} className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{pending ? 'Menyimpan...' : 'Simpan'}</button></div>
  </form>
}
export function BastbModal({ item }: { item?: Bastb }) {
  const [open, setOpen] = useState(false)
  return <><button onClick={() => setOpen(true)} className={item ? 'font-semibold text-slate-600 hover:text-slate-900' : 'rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800'}>{item ? 'Edit' : '+ Tambah BASTB'}</button><Modal open={open} onClose={() => setOpen(false)} title={item ? 'Edit BASTB' : 'Tambah BASTB'}><Form item={item} onSuccess={() => { setOpen(false); window.location.reload() }} onCancel={() => setOpen(false)} /></Modal></>
}
