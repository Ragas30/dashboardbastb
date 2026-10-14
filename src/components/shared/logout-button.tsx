import { signOutAction } from '@/app/actions/auth-actions'

export function LogoutButton() {
  return <form action={signOutAction}><button className="mt-8 w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-sm text-slate-500 hover:bg-slate-50">Keluar</button></form>
}
