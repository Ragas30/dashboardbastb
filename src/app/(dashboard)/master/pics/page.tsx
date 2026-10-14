import { getPics } from '@/features/pics/application/get-pics'
import { createPicRepository } from '@/features/pics/application/factories'
import { PicForm } from './_components/pic-form'
import { requireSupabaseUser } from '@/lib/supabase/auth'

export default async function PicsPage() {
  await requireSupabaseUser()
  const pics = await getPics(await createPicRepository())
  return <section className="p-6 sm:p-10"><div className="mb-8"><p className="text-sm text-slate-500">Master data</p><h1 className="text-3xl font-bold">Master PIC</h1></div><div className="mb-6"><PicForm /></div><div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm"><table className="w-full min-w-[500px] text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Nama PIC</th><th>Status</th><th>Action</th></tr></thead><tbody>{pics.length === 0 ? <tr><td className="px-5 py-8 text-center text-slate-500" colSpan={3}>Belum ada data PIC.</td></tr> : pics.map((pic) => <tr className="border-b border-slate-100 last:border-0" key={pic.id}><td className="px-5 py-4 font-medium">{pic.name}</td><td><span className={`rounded-full px-2 py-1 text-xs font-semibold ${pic.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{pic.status}</span></td><td><details><summary className="cursor-pointer font-semibold text-blue-600">Edit</summary><div className="mt-3 max-w-xl"><PicForm pic={pic} /></div></details></td></tr>)}</tbody></table></div></section>
}
