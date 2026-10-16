import { getDefects } from '@/features/defects/application'
import { createDefectRepository } from '@/features/defects/application/factories'
import { getPics } from '@/features/pics/application/get-pics'
import { createPicRepository } from '@/features/pics/application/factories'
import { requireSupabaseUser } from '@/lib/supabase/auth'
import { deleteDefectAction } from '@/app/actions/defect-actions'
import { ConfirmActionButton } from '@/components/shared/confirm-action-button'
import { Pagination } from '@/components/shared/pagination'
import { DefectCreateModal } from './_components/defect-create-modal'
import { DefectDetailModal } from './_components/defect-detail-modal'
import { DefectEditModal } from './_components/defect-edit-modal'
import { DefectStatusBadge } from '@/components/shared/defect-status-badge'

const PAGE_SIZE = 10

export default async function DefectsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireSupabaseUser()
  const params = await searchParams
  const search = typeof params.search === 'string' ? params.search : undefined
  const page = Math.max(1, Number(params.page) || 1)
  const [result, pics] = await Promise.all([
    getDefects(await createDefectRepository(), { search, page, pageSize: PAGE_SIZE }),
    getPics(await createPicRepository()),
  ])

  const buildPageHref = (target: number) => {
    const query = new URLSearchParams()
    if (search) query.set('search', search)
    if (target > 1) query.set('page', String(target))
    const suffix = query.toString()
    return suffix ? `/defects?${suffix}` : '/defects'
  }

  return (
    <section className="p-6 sm:p-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Pencatatan dan monitoring</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-700">List Defect</h1>
        </div>
        <DefectCreateModal pics={pics} />
      </div>

      <form className="mb-4 flex gap-2">
        <input className="w-full max-w-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" name="search" defaultValue={search} placeholder="Cari project, unit, PIC..." />
        <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm">Cari</button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        {result.items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 p-10 text-center text-sm text-slate-500">
            <p>Belum ada data defect.</p>
            <DefectCreateModal pics={pics} />
          </div>
        ) : (
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">No</th>
                <th className="py-3">Project / Cluster</th>
                <th className="py-3">Unit</th>
                <th className="py-3">Total Defect</th>
                <th className="py-3">PIC</th>
                <th className="py-3">Status</th>
                <th className="py-3">Target Repair</th>
                <th className="py-3">Last Update</th>
                <th className="py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {result.items.map((defect, index) => (
                <tr className="border-b border-slate-100 last:border-0" key={defect.id}>
                  <td className="px-5 py-4 text-slate-400">{(page - 1) * PAGE_SIZE + index + 1}</td>
                  <td className="font-medium">{defect.projectCluster}</td>
                  <td>{defect.unit}</td>
                  <td>{defect.totalDefect}</td>
                  <td>{defect.pic?.name ?? '-'}</td>
                  <td><DefectStatusBadge status={defect.status} /></td>
                  <td>{defect.targetRepair.toLocaleDateString('id-ID')}</td>
                  <td>{defect.updatedAt.toLocaleDateString('id-ID')}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <DefectDetailModal defect={defect} pics={pics} />
                      <DefectEditModal defect={defect} pics={pics} />
                      <ConfirmActionButton
                        label="Hapus"
                        title="Hapus Defect"
                        message="Apakah Anda yakin ingin menghapus data defect ini?"
                        action={deleteDefectAction}
                        hiddenFields={{ id: defect.id }}
                        buttonClassName="font-semibold text-red-600 hover:text-red-800"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
        <p>
          {result.total === 0
            ? 'Tidak ada data untuk ditampilkan.'
            : `Menampilkan ${(page - 1) * PAGE_SIZE + 1}-${(page - 1) * PAGE_SIZE + result.items.length} dari ${result.total} data.`}
        </p>
        <Pagination page={page} pageSize={PAGE_SIZE} total={result.total} buildHref={buildPageHref} />
      </div>
    </section>
  )
}
