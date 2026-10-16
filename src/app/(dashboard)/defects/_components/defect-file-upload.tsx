'use client'

import { useRef, useState } from 'react'
import { uploadDefectFileAction } from '@/app/actions/defect-actions'
import type { DefectFileStage } from '@/features/defects/domain/defect-file-stage'
import { DEFECT_FILE_STAGE_LABELS } from './defect-file-labels'

export function DefectFileUpload({
  defectId,
  stage,
  onUploaded,
}: {
  defectId: number
  stage: DefectFileStage
  onUploaded: () => void
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setPending(true)
    setError(null)
    const result = await uploadDefectFileAction(formData)
    setPending(false)
    if (!result.ok) {
      setError(result.message)
      return
    }
    formRef.current?.reset()
    onUploaded()
  }

  return (
    <form ref={formRef} action={handleSubmit}>
      <input type="hidden" name="defectId" value={defectId} />
      <input type="hidden" name="stage" value={stage} />
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="file"
          name="file"
          accept="application/pdf,.pdf"
          required
          className="text-xs text-slate-600 file:mr-2 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-slate-600 hover:file:bg-slate-200"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {pending ? 'Mengunggah...' : `Unggah (${DEFECT_FILE_STAGE_LABELS[stage]})`}
        </button>
      </div>
      <p className="mt-1 text-xs text-slate-400">PDF, maksimal 5 MB.</p>
      {error && <p className="mt-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}
    </form>
  )
}
