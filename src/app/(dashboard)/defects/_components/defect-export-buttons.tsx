export function DefectExportButtons({ query = '' }: { query?: string }) {
  const suffix = query ? `&${query}` : ''
  const className =
    'rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50'

  return (
    <div className="flex items-center gap-2">
      <a href={`/api/defects/export?format=csv${suffix}`} className={className}>
        Export CSV
      </a>
      <a href={`/api/defects/export?format=pdf${suffix}`} className={className}>
        Export PDF
      </a>
    </div>
  )
}
