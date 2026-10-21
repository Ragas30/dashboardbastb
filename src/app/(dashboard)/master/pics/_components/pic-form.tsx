'use client'

import { useActionState } from 'react'
import { createPicAction, updatePicAction, type ActionResult } from '@/app/actions/pic-actions'
import type { Pic } from '@/features/pics/types/pic-types'
import { useToastStore } from '@/stores/toast-store'

export function PicForm({
  pic,
  onSuccess,
  onCancel,
}: {
  pic?: Pic
  onSuccess?: () => void
  onCancel?: () => void
}) {
  const action = pic ? updatePicAction : createPicAction
  const addToast = useToastStore((state) => state.add)
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    async (_previous, formData) => {
      const result = await action(formData)
      if (result.ok) { addToast(pic ? 'PIC berhasil diperbarui.' : 'PIC berhasil ditambahkan.'); onSuccess?.() }
      return result
    },
    { ok: true },
  )

  const inputClass = 'mt-2 w-full rounded-lg border border-slate-300 px-3 py-2'

  return (
    <form action={formAction} className="space-y-5">
      <label className="block text-sm font-medium text-slate-600">
        Nama PIC
        <input name="name" required defaultValue={pic?.name} className={inputClass} />
      </label>
      <label className="block text-sm font-medium text-slate-600">
        Status
        <select name="status" defaultValue={pic?.status ?? 'ACTIVE'} className={inputClass}>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </label>

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
          {pending ? 'Menyimpan...' : pic ? 'Simpan Perubahan' : 'Simpan'}
        </button>
      </div>
    </form>
  )
}
