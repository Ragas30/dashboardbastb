'use client'
export default function Error({ reset }: { reset: () => void }) { return <div className="p-10"><p className="text-sm text-red-600">Dashboard gagal dimuat.</p><button className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white" onClick={reset}>Coba lagi</button></div> }
