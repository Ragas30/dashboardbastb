'use client'

import { ModalButton } from '@/components/shared/modal-button'
import { PicForm } from './pic-form'
import type { Pic } from '@/features/pics/types/pic-types'

export function PicEditModal({ pic }: { pic: Pic }) {
  return (
    <ModalButton label="Edit" title={`Edit PIC - ${pic.name}`} buttonClassName="font-semibold text-blue-600">
      {(close) => <PicForm pic={pic} onSuccess={close} onCancel={close} />}
    </ModalButton>
  )
}
