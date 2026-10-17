'use client'

import { useRef, useState } from 'react'
import { ModalButton } from '@/components/shared/modal-button'
import { importDefectsAction, type DefectImportActionResult } from '@/app/actions/defect-actions'

export function DefectImportModal() {
  return (
    <ModalButton
      label="Import CSV"
      title="Import Defect"
      buttonClassName="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
    >
      {(close) => <DefectImportForm close={close} />}
    </ModalButton>
  )
}

function DefectImportForm({ close }: { close: () => void }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<DefectImportActionResult | null>(null)

  async function handleSubmit(formData: FormData) {
    setPending(true)
    setResult(null)
    const response = await importDefectsAction(formData)
    setPending(false)
    setResult(response)
    if (response.ok) formRef.current?.reset()
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <input
        type="file"
        name="file"
        accept=".csv,text/csv"
        required
        className="w-full text-sm text-slate-600 file:mr-2 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-600 hover:file:bg-slate-200"
      />
      <p className="text-xs text-slate-400">
        Format CSV dengan header: Project / Cluster, Unit, Tanggal, Total Defect, PIC, Target Repair, Status. Maksimal 2 MB.
      </p>

      {result && !result.ok && (
        <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{result.message}</p>
      )}

      {result && result.ok && (
        <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
          <p className="font-semibold text-slate-700">Berhasil menambahkan {result.created} defect.</p>
          {result.errors.length > 0 && (
            <div className="space-y-1">
              <p className="text-slate-500">{result.errors.length} baris dilewati:</p>
              <ul className="max-h-40 space-y-1 overflow-y-auto text-xs text-red-600">
                {result.errors.map((error) => (
                  <li key={error.row}>Baris {error.row}: {error.message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={close}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Tutup
        </button>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {pending ? 'Mengimpor...' : 'Import'}
        </button>
      </div>
    </form>
  )
}
