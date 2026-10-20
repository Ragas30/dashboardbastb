'use client'

import { ModalButton } from '@/components/shared/modal-button'
import { DefectForm } from './defect-form'
import type { Defect } from '@/features/defects/types/defect-types'
import type { Pic } from '@/features/pics/types/pic-types'
import type { Bastb } from '@/features/bastbs/types/bastb-types'

export function DefectEditModal({
  defect,
  pics,
  bastbs = [],
  buttonClassName = 'font-semibold text-blue-600',
}: {
  defect: Defect
  pics: Pic[]
  bastbs?: Bastb[]
  buttonClassName?: string
}) {
  return (
    <ModalButton label="Edit" title={`Edit Defect #${defect.id}`} buttonClassName={buttonClassName}>
      {(close) => <DefectForm defect={defect} pics={pics} bastbs={bastbs} onSuccess={close} onCancel={close} />}
    </ModalButton>
  )
}
