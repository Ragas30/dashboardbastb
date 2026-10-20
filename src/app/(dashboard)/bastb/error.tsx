'use client'
export default function Error({ reset }: { reset: () => void }) { return <div className="p-6 text-sm text-red-600 sm:p-10"><p>Terjadi kesalahan saat memuat data BASTB.</p><button onClick={reset} className="mt-3 rounded-lg bg-slate-700 px-4 py-2 text-white">Coba lagi</button></div> }
