'use client'

import { ModalButton } from '@/components/shared/modal-button'
import { PicForm } from './pic-form'

export function PicCreateModal() {
  return (
    <ModalButton
      label="+ Tambah PIC"
      title="Tambah PIC"
      buttonClassName="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
    >
      {(close) => <PicForm onSuccess={close} onCancel={close} />}
    </ModalButton>
  )
}
