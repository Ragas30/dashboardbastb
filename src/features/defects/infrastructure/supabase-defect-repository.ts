import { InfrastructureError, NotFoundError } from '@/lib/errors'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { DefectRepository } from '../application/defect-repository'
import type { Defect, DefectFilters, DefectInput, DefectSummary } from '../types/defect-types'

type DefectRow = {
  id: number
  project_cluster: string
  unit: string
  defect_date: string
  total_defect: number
  pic_id: number
  target_repair: string
  status: Defect['status']
  created_at: string
  updated_at: string
  master_pics?: { id: number; name: string; status: 'ACTIVE' | 'INACTIVE' } | null
}

function mapDefect(row: DefectRow): Defect {
  return {
    id: row.id, projectCluster: row.project_cluster, unit: row.unit,
    defectDate: new Date(row.defect_date), totalDefect: row.total_defect,
    picId: row.pic_id, targetRepair: new Date(row.target_repair), status: row.status,
    createdAt: new Date(row.created_at), updatedAt: new Date(row.updated_at),
    pic: row.master_pics ? { id: row.master_pics.id, name: row.master_pics.name, status: row.master_pics.status } : undefined,
  }
}

export class SupabaseDefectRepository implements DefectRepository {
  constructor(private readonly client: SupabaseClient) {}

  async list(filters: DefectFilters) {
    let query = this.client.from('defects').select('*, master_pics!inner(id,name,status)', { count: 'exact' })
    if (filters.projectCluster) query = query.eq('project_cluster', filters.projectCluster)
    if (filters.unit) query = query.eq('unit', filters.unit)
    if (filters.picId) query = query.eq('pic_id', filters.picId)
    if (filters.status) query = query.eq('status', filters.status)
    if (filters.defectDateFrom) query = query.gte('defect_date', filters.defectDateFrom.toISOString().slice(0, 10))
    if (filters.defectDateTo) query = query.lte('defect_date', filters.defectDateTo.toISOString().slice(0, 10))
    if (filters.search) {
      const term = filters.search.replace(/[(),]/g, ' ')
      const { data: matchingPics, error: picError } = await this.client.from('master_pics').select('id').ilike('name', `%${term}%`)
      if (picError) throw new InfrastructureError('Gagal mencari PIC.', picError)
      const ids = (matchingPics ?? []).map((pic) => pic.id).join(',')
      query = query.or(`project_cluster.ilike.%${term}%,unit.ilike.%${term}%${ids ? `,pic_id.in.(${ids})` : ''}`)
    }
    const page = Math.max(1, filters.page ?? 1)
    const pageSize = Math.max(1, filters.pageSize ?? 10)
    const { data, count, error } = await query.order('updated_at', { ascending: false }).range((page - 1) * pageSize, page * pageSize - 1)
    if (error) throw new InfrastructureError('Gagal mengambil data defect.', error)
    return { items: (data ?? []).map(mapDefect), total: count ?? 0 }
  }

  async findById(id: number) {
    const { data, error } = await this.client.from('defects').select('*, master_pics!inner(id,name,status)').eq('id', id).maybeSingle()
    if (error) throw new InfrastructureError('Gagal mengambil detail defect.', error)
    return data ? mapDefect(data) : null
  }

  async findPicById(id: number) {
    const { data, error } = await this.client.from('master_pics').select('id,name,status').eq('id', id).maybeSingle()
    if (error) throw new InfrastructureError('Gagal memeriksa PIC.', error)
    return data
  }

  async create(input: DefectInput) {
    const { data, error } = await this.client.from('defects').insert({
      project_cluster: input.projectCluster, unit: input.unit, defect_date: input.defectDate.toISOString().slice(0, 10),
      total_defect: input.totalDefect, pic_id: input.picId, target_repair: input.targetRepair.toISOString().slice(0, 10), status: input.status,
    }).select('*, master_pics!inner(id,name,status)').single()
    if (error) throw new InfrastructureError('Gagal menyimpan defect.', error)
    return mapDefect(data)
  }

  async update(id: number, input: DefectInput) {
    const { data, error } = await this.client.from('defects').update({
      project_cluster: input.projectCluster, unit: input.unit, defect_date: input.defectDate.toISOString().slice(0, 10),
      total_defect: input.totalDefect, pic_id: input.picId, target_repair: input.targetRepair.toISOString().slice(0, 10), status: input.status,
    }).eq('id', id).select('*, master_pics!inner(id,name,status)').maybeSingle()
    if (error) throw new InfrastructureError('Gagal memperbarui defect.', error)
    if (!data) throw new NotFoundError('Defect tidak ditemukan.')
    return mapDefect(data)
  }

  async delete(id: number) {
    const { error, count } = await this.client.from('defects').delete({ count: 'exact' }).eq('id', id)
    if (error) throw new InfrastructureError('Gagal menghapus defect.', error)
    if (count === 0) throw new NotFoundError('Defect tidak ditemukan.')
  }

  async summary(filters: Omit<DefectFilters, 'page' | 'pageSize'>): Promise<DefectSummary> {
    const { items } = await this.list({ ...filters, page: 1, pageSize: 10000 })
    return items.reduce<DefectSummary>((sum, item) => {
      sum.total += item.totalDefect
      if (item.status === 'OPEN') sum.open += item.totalDefect
      if (item.status === 'ON_PROGRESS') sum.onProgress += item.totalDefect
      if (item.status === 'COMPLETED') sum.completed += item.totalDefect
      return sum
    }, { total: 0, open: 0, onProgress: 0, completed: 0 })
  }
}
