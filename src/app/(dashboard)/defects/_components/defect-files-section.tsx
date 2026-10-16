'use client'

import { useCallback, useEffect, useState } from 'react'
import { deleteDefectFileAction, listDefectFilesAction } from '@/app/actions/defect-actions'
import type { DefectFilesResult } from '@/app/actions/defect-actions'
import { Modal } from '@/components/ui/modal'
import { DEFECT_FILE_STAGES } from '@/features/defects/domain/defect-file-stage'
import type { DefectFile } from '@/features/defects/types/defect-types'
import { DEFECT_FILE_STAGE_LABELS, formatFileSize } from './defect-file-labels'
import { DefectFileUpload } from './defect-file-upload'

export function DefectFilesSection({ defectId }: { defectId: number }) {
  const [files, setFiles] = useState<DefectFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [target, setTarget] = useState<DefectFile | null>(null)
  const [pending, setPending] = useState(false)

  const applyResult = useCallback((result: DefectFilesResult) => {
    setLoading(false)
    if (!result.ok) {
      setError(result.message)
      return
    }
    setError(null)
    setFiles(result.files)
  }, [])

  useEffect(() => {
    let active = true
    void listDefectFilesAction(defectId).then((result) => { if (active) applyResult(result) })
    return () => { active = false }
  }, [defectId, applyResult])

  const refresh = useCallback(async () => {
    setLoading(true)
    applyResult(await listDefectFilesAction(defectId))
  }, [defectId, applyResult])

  async function confirmDelete() {
    if (!target) return
    setPending(true)
    const formData = new FormData()
    formData.set('id', String(target.id))
    const result = await deleteDefectFileAction(formData)
    setPending(false)
    if (!result.ok) {
      setError(result.message)
      setTarget(null)
      return
    }
    setTarget(null)
    await refresh()
  }

  return (
    <div className="space-y-4 border-t border-slate-100 pt-5">
      <h3 className="text-sm font-semibold text-slate-700">Lampiran PDF</h3>
      {DEFECT_FILE_STAGES.map((stage) => {
        const stageFiles = files.filter((file) => file.stage === stage)
        return (
          <div key={stage} className="rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{DEFECT_FILE_STAGE_LABELS[stage]}</p>
            {loading ? (
              <p className="mt-2 text-sm text-slate-400">Memuat lampiran...</p>
            ) : stageFiles.length === 0 ? (
              <p className="mt-2 text-sm text-slate-400">Belum ada file.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {stageFiles.map((file) => (
                  <li key={file.id} className="flex items-center gap-3 text-sm">
                    <span className="min-w-0 flex-1 truncate text-slate-700">{file.fileName}</span>
                    <span className="shrink-0 text-xs text-slate-400">{formatFileSize(file.fileSize)}</span>
                    {file.signedUrl ? (
                      <a href={file.signedUrl} target="_blank" rel="noreferrer" className="shrink-0 font-semibold text-blue-600 hover:text-blue-800">
                        Lihat
                      </a>
                    ) : null}
                    <button type="button" onClick={() => setTarget(file)} className="shrink-0 font-semibold text-red-600 hover:text-red-800">
                      Hapus
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-3">
              <DefectFileUpload defectId={defectId} stage={stage} onUploaded={refresh} />
            </div>
          </div>
        )
      })}
      {error && <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <Modal open={target !== null} onClose={() => setTarget(null)} title="Hapus Lampiran">
        <p className="text-sm text-slate-600">Apakah Anda yakin ingin menghapus lampiran ini?</p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setTarget(null)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            disabled={pending}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {pending ? 'Memproses...' : 'Hapus'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
