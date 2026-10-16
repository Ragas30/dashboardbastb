'use client'

import { useActionState } from 'react'
import { ModalButton } from '@/components/shared/modal-button'
import { updateDefectStatusAction, type ActionResult } from '@/app/actions/defect-actions'
import { DEFECT_STATUSES, type DefectStatus } from '@/features/defects/domain/defect-status'
import { DEFECT_STATUS_LABELS } from '@/components/shared/defect-status-labels'

function StatusForm({ id, status, onDone }: { id: number; status: DefectStatus; onDone: () => void }) {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(async (_previous, formData) => {
    const result = await updateDefectStatusAction(formData)
    if (result.ok) onDone()
    return result
  }, { ok: true })

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="id" value={id} />
      <label className="block text-sm font-medium text-slate-600">
        Status
        <select name="status" defaultValue={status} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2">
          {DEFECT_STATUSES.map((value) => (
            <option key={value} value={value}>{DEFECT_STATUS_LABELS[value]}</option>
          ))}
        </select>
      </label>

      {!state.ok && (
        <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{state.message}</p>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onDone}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-slate-700 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {pending ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </form>
  )
}

export function DefectStatusModal({ id, status }: { id: number; status: DefectStatus }) {
  return (
    <ModalButton
      label="Update Status"
      title={`Update Status Defect #${id}`}
      buttonClassName="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
    >
      {(close) => <StatusForm id={id} status={status} onDone={close} />}
    </ModalButton>
  )
}
