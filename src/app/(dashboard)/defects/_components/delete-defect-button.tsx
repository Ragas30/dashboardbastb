'use client'
import { deleteDefectAction } from '@/app/actions/defect-actions'

export function DeleteDefectButton({ id }: { id: number }) {
  return <form action={deleteDefectAction} onSubmit={(event) => { if (!window.confirm('Data defect akan dihapus. Apakah Anda yakin?')) event.preventDefault() }}><input type="hidden" name="id" value={id} /><button className="text-sm font-semibold text-red-600 hover:text-red-800" type="submit">Hapus</button></form>
}
