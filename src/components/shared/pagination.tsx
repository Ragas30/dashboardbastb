import Link from 'next/link'

const itemClass = 'rounded-lg border border-slate-300 px-3 py-1 hover:bg-slate-100'
const activeClass = 'rounded-lg border border-slate-700 bg-slate-700 px-3 py-1 font-semibold text-white'

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)

  const pages: (number | 'ellipsis')[] = [1]
  if (current > 4) pages.push('ellipsis')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let page = start; page <= end; page += 1) pages.push(page)

  if (current < total - 3) pages.push('ellipsis')
  pages.push(total)

  return pages
}

export function Pagination({
  page,
  pageSize,
  total,
  buildHref,
}: {
  page: number
  pageSize: number
  total: number
  buildHref: (page: number) => string
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  if (totalPages <= 1) return null

  return (
    <nav className="flex items-center gap-2" aria-label="Navigasi halaman">
      {page > 1 && <Link className={itemClass} href={buildHref(page - 1)}>Sebelumnya</Link>}
      {getPageNumbers(page, totalPages).map((entry, index) =>
        entry === 'ellipsis' ? (
          <span className="px-1 text-slate-400" key={`ellipsis-${index}`}>...</span>
        ) : (
          <Link className={entry === page ? activeClass : itemClass} href={buildHref(entry)} key={entry}>
            {entry}
          </Link>
        ),
      )}
      {page < totalPages && <Link className={itemClass} href={buildHref(page + 1)}>Berikutnya</Link>}
    </nav>
  )
}
