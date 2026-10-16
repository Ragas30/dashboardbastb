'use client'

import { useState, type ReactNode } from 'react'
import { Modal } from '@/components/ui/modal'

export function ModalButton({
  label,
  title,
  buttonClassName,
  children,
}: {
  label: ReactNode
  title: string
  buttonClassName?: string
  children: (close: () => void) => ReactNode
}) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={buttonClassName}>
        {label}
      </button>
      <Modal open={open} onClose={close} title={title}>
        {children(close)}
      </Modal>
    </>
  )
}
