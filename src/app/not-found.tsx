import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-center">
      <div>
        <p className="text-sm font-medium text-slate-500">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-700">Halaman tidak ditemukan</h1>
        <p className="mt-2 text-sm text-slate-500">Halaman yang Anda cari tidak tersedia atau sudah dipindahkan.</p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </main>
  )
}
