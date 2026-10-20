'use client'

import { ModalButton } from '@/components/shared/modal-button'
import { DefectForm } from './defect-form'
import type { Pic } from '@/features/pics/types/pic-types'
import type { Bastb } from '@/features/bastbs/types/bastb-types'

export function DefectCreateModal({ pics, bastbs = [] }: { pics: Pic[]; bastbs?: Bastb[] }) {
  return (
    <ModalButton
      label="+ Tambah Defect"
      title="Tambah Defect"
      buttonClassName="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
    >
      {(close) => <DefectForm pics={pics} bastbs={bastbs} onSuccess={close} onCancel={close} />}
    </ModalButton>
  )
}
