import type { Pic } from '@/features/pics/types/pic-types'
import { createDefectAction, updateDefectAction } from '@/app/actions/defect-actions'
import type { Defect } from '@/features/defects/types/defect-types'

function dateValue(value: Date | undefined) { return value ? value.toISOString().slice(0, 10) : '' }

export function DefectForm({ defect, pics }: { defect?: Defect; pics: Pic[] }) {
  const action = defect ? updateDefectAction : createDefectAction
  return <form action={action} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    {defect && <input type="hidden" name="id" value={defect.id} />}
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm font-medium">Project / Cluster<input required name="projectCluster" defaultValue={defect?.projectCluster} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
      <label className="text-sm font-medium">Unit<input required name="unit" defaultValue={defect?.unit} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
      <label className="text-sm font-medium">Tanggal<input required type="date" name="defectDate" defaultValue={dateValue(defect?.defectDate)} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
      <label className="text-sm font-medium">Total Defect<input required min="1" type="number" name="totalDefect" defaultValue={defect?.totalDefect ?? 1} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
      <label className="text-sm font-medium">PIC<select required name="picId" defaultValue={defect?.picId} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"><option value="">Pilih PIC</option>{pics.filter((pic) => pic.status === 'ACTIVE' || pic.id === defect?.picId).map((pic) => <option key={pic.id} value={pic.id}>{pic.name}</option>)}</select></label>
      <label className="text-sm font-medium">Target Repair<input required type="date" name="targetRepair" defaultValue={dateValue(defect?.targetRepair)} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
      <label className="text-sm font-medium sm:col-span-2">Status<select name="status" defaultValue={defect?.status ?? 'OPEN'} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"><option value="OPEN">Open</option><option value="ON_PROGRESS">On Progress</option><option value="COMPLETED">Completed</option></select></label>
    </div>
    <button className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white" type="submit">{defect ? 'Simpan Perubahan' : 'Simpan Defect'}</button>
  </form>
}
