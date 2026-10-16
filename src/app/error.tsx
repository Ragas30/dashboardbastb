'use client'

export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-700">Terjadi kesalahan pada sistem</h1>
        <p className="mt-2 text-sm text-slate-500">Silakan coba lagi.</p>
        <button
          type="button"
          onClick={() => retry()}
          className="mt-6 rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Coba lagi
        </button>
      </div>
    </main>
  )
}
