import { Badge } from '@/components/ui/badge'
import { getPics } from '@/features/pics/application/get-pics'
import { createPicRepository } from '@/features/pics/application/factories'
import { requireSupabaseUser } from '@/lib/supabase/auth'
import { PicCreateModal } from './_components/pic-create-modal'
import { PicEditModal } from './_components/pic-edit-modal'
import { DataTable, DataTableHead } from '@/components/shared/data-table'
import { SortableHeader } from '@/components/shared/sortable-header'

export default async function PicsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireSupabaseUser()
  const params = await searchParams
  const sort = typeof params.sort === 'string' ? params.sort : ''
  const direction = params.direction === 'desc' ? -1 : 1
  const pics = (await getPics(await createPicRepository())).sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) * direction : sort === 'status' ? a.status.localeCompare(b.status) * direction : a.id - b.id)
  return (
    <section className="p-6 sm:p-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Master data</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-700">Master PIC</h1>
        </div>
        <PicCreateModal />
      </div>

      <DataTable>
        <table className="w-full min-w-[500px] text-left text-sm">
          <DataTableHead>
            <tr>
              <th className="px-5 py-3">No</th>
              <th className="py-3"><SortableHeader label="Nama PIC" field="name" /></th>
              <th className="py-3"><SortableHeader label="Status" field="status" /></th>
              <th className="py-3">Action</th>
            </tr>
          </DataTableHead>
          <tbody>
            {pics.length === 0 ? (
              <tr>
                <td className="px-5 py-8 text-center text-slate-500" colSpan={4}>Belum ada data PIC.</td>
              </tr>
            ) : (
              pics.map((pic, index) => (
                <tr className="border-b border-slate-100 last:border-0" key={pic.id}>
                  <td className="px-5 py-4 text-slate-400">{index + 1}</td>
                  <td className="font-medium">{pic.name}</td>
                  <td><Badge tone={pic.status === 'ACTIVE' ? 'success' : 'neutral'}>{pic.status === 'ACTIVE' ? 'Active' : 'Inactive'}</Badge></td>
                  <td><PicEditModal pic={pic} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </DataTable>
    </section>
  )
}
