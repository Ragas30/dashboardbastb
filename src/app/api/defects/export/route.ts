import { getDefectExport } from '@/features/defects/application'
import { createDefectRepository } from '@/features/defects/application/factories'
import { serializeDefectsCsv } from '@/features/defects/infrastructure/defect-csv'
import { buildDefectsPdf } from '@/features/defects/infrastructure/defect-pdf'
import { DEFECT_STATUSES, type DefectStatus } from '@/features/defects/domain/defect-status'
import type { DefectFilters } from '@/features/defects/types/defect-types'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const client = await createSupabaseServerClient()
  const { data: { user } } = await client.auth.getUser()
  if (!user) return new Response('Anda harus login untuk mengunduh data.', { status: 401 })

  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format') === 'pdf' ? 'pdf' : 'csv'

  try {
    const { items } = await getDefectExport(await createDefectRepository(), parseFilters(searchParams))
    const generatedAt = new Date()
    const filename = `defect-${formatTimestamp(generatedAt)}`

    if (format === 'pdf') {
      const body = await buildDefectsPdf(items, { title: 'Daftar Defect', generatedAt })
      return new Response(body, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}.pdf"`,
        },
      })
    }

    return new Response(serializeDefectsCsv(items), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}.csv"`,
      },
    })
  } catch {
    return new Response('Terjadi kesalahan pada sistem. Silakan coba lagi.', { status: 500 })
  }
}

function parseFilters(searchParams: URLSearchParams): Omit<DefectFilters, 'page' | 'pageSize'> {
  const filters: Omit<DefectFilters, 'page' | 'pageSize'> = {}
  const search = searchParams.get('search')?.trim()
  const projectCluster = searchParams.get('projectCluster')?.trim()
  const unit = searchParams.get('unit')?.trim()
  const status = searchParams.get('status')

  if (search) filters.search = search
  if (projectCluster) filters.projectCluster = projectCluster
  if (unit) filters.unit = unit
  if (status && (DEFECT_STATUSES as readonly string[]).includes(status)) filters.status = status as DefectStatus

  const picId = Number(searchParams.get('picId'))
  if (Number.isInteger(picId) && picId > 0) filters.picId = picId

  filters.defectDateFrom = parseDate(searchParams.get('defectDateFrom'))
  filters.defectDateTo = parseDate(searchParams.get('defectDateTo'))
  return filters
}

function parseDate(value: string | null): Date | undefined {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

function formatTimestamp(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}`
}
