'use client'
export default function Error({ reset }: { reset: () => void }) { return <div className="p-10"><p className="text-sm text-red-600">Data defect gagal dimuat.</p><button className="mt-4 rounded-lg bg-slate-700 px-4 py-2 text-sm text-white" onClick={reset}>Coba lagi</button></div> }
