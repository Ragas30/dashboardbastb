'use client'

import { useState, type ReactNode } from 'react'
import { Modal } from '@/components/ui/modal'

type ActionResultLike = { ok: boolean; message?: string } | void

export function ConfirmActionButton({
  label,
  title,
  message,
  confirmLabel = 'Hapus',
  action,
  hiddenFields,
  buttonClassName,
  confirmClassName,
}: {
  label: ReactNode
  title: string
  message: string
  confirmLabel?: string
  action: (formData: FormData) => Promise<ActionResultLike>
  hiddenFields?: Record<string, string | number>
  buttonClassName?: string
  confirmClassName?: string
}) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    setPending(true)
    setError(null)
    const formData = new FormData()
    Object.entries(hiddenFields ?? {}).forEach(([key, value]) => formData.set(key, String(value)))
    try {
      const result = await action(formData)
      if (result && typeof result === 'object' && 'ok' in result && !result.ok) {
        setError(result.message ?? 'Terjadi kesalahan pada sistem. Silakan coba lagi.')
        return
      }
      setOpen(false)
    } catch {
      setError('Terjadi kesalahan pada sistem. Silakan coba lagi.')
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={buttonClassName}>
        {label}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={title}>
        <p className="text-sm text-slate-600">{message}</p>
        {error && <p className="mt-3 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={pending}
            className={confirmClassName ?? 'rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60'}
          >
            {pending ? 'Memproses...' : confirmLabel}
          </button>
        </div>
      </Modal>
    </>
  )
}
