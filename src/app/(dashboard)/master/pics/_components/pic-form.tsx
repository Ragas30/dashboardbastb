import { createPicAction, updatePicAction } from '@/app/actions/pic-actions'
import type { Pic } from '@/features/pics/types/pic-types'

export function PicForm({ pic }: { pic?: Pic }) {
  return <form action={pic ? updatePicAction : createPicAction} className="flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    {pic && <input type="hidden" name="id" value={pic.id} />}
    <label className="min-w-56 flex-1 text-sm font-medium">Nama PIC<input required name="name" defaultValue={pic?.name} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
    <label className="text-sm font-medium">Status<select name="status" defaultValue={pic?.status ?? 'ACTIVE'} className="mt-2 rounded-lg border border-slate-300 px-3 py-2"><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select></label>
    <button className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white" type="submit">{pic ? 'Simpan' : 'Tambah PIC'}</button>
  </form>
}
