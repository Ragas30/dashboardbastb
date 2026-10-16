'use client'

import { ModalButton } from '@/components/shared/modal-button'
import { ConfirmActionButton } from '@/components/shared/confirm-action-button'
import { deleteDefectAction } from '@/app/actions/defect-actions'
import type { Defect } from '@/features/defects/types/defect-types'
import type { Pic } from '@/features/pics/types/pic-types'
import { DefectDetail } from './defect-detail'
import { DefectEditModal } from './defect-edit-modal'
import { DefectStatusModal } from './defect-status-modal'

const actionClass = 'rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50'

export function DefectDetailModal({
  defect,
  pics,
  buttonClassName = 'font-semibold text-blue-600',
}: {
  defect: Defect
  pics: Pic[]
  buttonClassName?: string
}) {
  return (
    <ModalButton label="Detail" title={`Defect #${defect.id}`} buttonClassName={buttonClassName}>
      {() => (
        <div className="space-y-6">
          <DefectDetail defect={defect} />
          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
            <DefectEditModal defect={defect} pics={pics} buttonClassName={actionClass} />
            <DefectStatusModal id={defect.id} status={defect.status} />
            <ConfirmActionButton
              label="Hapus"
              title="Hapus Defect"
              message="Apakah Anda yakin ingin menghapus data defect ini?"
              action={deleteDefectAction}
              hiddenFields={{ id: defect.id }}
              buttonClassName="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
            />
          </div>
        </div>
      )}
    </ModalButton>
  )
}
