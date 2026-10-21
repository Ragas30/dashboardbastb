'use client'

import { useActionState, useState } from 'react'
import type { Pic } from '@/features/pics/types/pic-types'
import { createDefectAction, updateDefectAction, type ActionResult } from '@/app/actions/defect-actions'
import type { Defect } from '@/features/defects/types/defect-types'
import type { Bastb } from '@/features/bastbs/types/bastb-types'
import { useToastStore } from '@/stores/toast-store'

function dateValue(value: Date | undefined) {
  return value ? value.toISOString().slice(0, 10) : ''
}

export function DefectForm({
  defect,
  pics,
  bastbs = [],
  onSuccess,
  onCancel,
}: {
  defect?: Defect
  pics: Pic[]
  bastbs?: Bastb[]
  onSuccess?: () => void
  onCancel?: () => void
}) {
  const selectedBastb = bastbs.find((item) => item.id === defect?.bastbId)
  const [cluster, setCluster] = useState(defect?.projectCluster ?? selectedBastb?.cluster ?? '')
  const [unit, setUnit] = useState(defect?.unit ?? selectedBastb?.noUnit ?? '')
  const action = defect ? updateDefectAction : createDefectAction
  const addToast = useToastStore((state) => state.add)
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    async (_previous, formData) => {
      const result = await action(formData)
      if (result.ok) { addToast(defect ? 'Defect berhasil diperbarui.' : 'Defect berhasil ditambahkan.'); onSuccess?.() }
      return result
    },
    { ok: true },
  )

  const inputClass = 'mt-2 w-full rounded-lg border border-slate-300 px-3 py-2'

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-600 sm:col-span-2">
          BASTB
          <select name="bastbId" required={!defect} defaultValue={defect?.bastbId ?? ''} className={inputClass} onChange={(event) => { const item = bastbs.find((candidate) => candidate.id === Number(event.target.value)); setCluster(item?.cluster ?? ''); setUnit(item?.noUnit ?? '') }}>
            <option value="">Pilih BASTB</option>
            {bastbs.map((item) => <option key={item.id} value={item.id}>{item.cluster} - {item.noUnit} - {item.bastbDate.toLocaleDateString('id-ID')}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-slate-600">
          Project / Cluster
          <input name="projectCluster" required value={cluster} readOnly className={`${inputClass} bg-slate-50`} />
        </label>
        <label className="text-sm font-medium text-slate-600">
          Unit
          <input name="unit" required value={unit} readOnly className={`${inputClass} bg-slate-50`} />
        </label>
        <label className="text-sm font-medium text-slate-600">
          Tanggal
          <input type="date" name="defectDate" required defaultValue={dateValue(defect?.defectDate)} className={inputClass} />
        </label>
        <label className="text-sm font-medium text-slate-600">
          Total Defect
          <input type="number" name="totalDefect" required min={1} defaultValue={defect?.totalDefect ?? 1} className={inputClass} />
        </label>
        <label className="text-sm font-medium text-slate-600">
          PIC
          <select name="picId" required defaultValue={defect?.picId} className={inputClass}>
            <option value="">Pilih PIC</option>
            {pics
              .filter((pic) => pic.status === 'ACTIVE' || pic.id === defect?.picId)
              .map((pic) => (
                <option key={pic.id} value={pic.id}>
                  {pic.name}
                </option>
              ))}
          </select>
        </label>
        <label className="text-sm font-medium text-slate-600">
          Target Repair
          <input type="date" name="targetRepair" required defaultValue={dateValue(defect?.targetRepair)} className={inputClass} />
        </label>
        <label className="text-sm font-medium text-slate-600 sm:col-span-2">
          Status
          <select name="status" defaultValue={defect?.status ?? 'OPEN'} className={inputClass}>
            <option value="OPEN">Open</option>
            <option value="ON_PROGRESS">On Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </label>
      </div>

      {!state.ok && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <p>{state.message}</p>
          {state.fieldErrors && (
            <ul className="mt-1 list-disc pl-5">
              {Object.values(state.fieldErrors).flat().map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-slate-700 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {pending ? 'Menyimpan...' : defect ? 'Simpan Perubahan' : 'Simpan'}
        </button>
      </div>
    </form>
  )
}
