import type { SupabaseClient } from '@supabase/supabase-js'
import { InfrastructureError, NotFoundError } from '@/lib/errors'
import type { BastbRepository } from '../application/bastb-repository'
import type { Bastb, BastbInput } from '../types/bastb-types'

function map(row: { id: number; cluster: string; no_unit: string; bastb_date: string; created_at: string; updated_at: string }): Bastb {
  return { id: row.id, cluster: row.cluster, noUnit: row.no_unit, bastbDate: new Date(row.bastb_date), createdAt: new Date(row.created_at), updatedAt: new Date(row.updated_at) }
}

export class SupabaseBastbRepository implements BastbRepository {
  constructor(private readonly client: SupabaseClient) {}
  async list(search?: string) {
    let query = this.client.from('bastbs').select('*').order('bastb_date', { ascending: false }).order('id', { ascending: false })
    if (search) { const term = search.replace(/[(),]/g, ' '); query = query.or(`cluster.ilike.%${term}%,no_unit.ilike.%${term}%`) }
    const { data, error } = await query
    if (error) throw new InfrastructureError('Gagal mengambil data BASTB.', error)
    return (data ?? []).map(map)
  }
  async listAvailableForDefect(search?: string) {
    const { data, error } = await this.client.from('defects').select('bastb_id').not('bastb_id', 'is', null)
    if (error) throw new InfrastructureError('Gagal memeriksa BASTB yang sudah digunakan.', error)
    const usedIds = new Set((data ?? []).map((row) => row.bastb_id as number))
    const items = await this.list(search)
    return items.filter((item) => !usedIds.has(item.id))
  }
  async findById(id: number) {
    const { data, error } = await this.client.from('bastbs').select('*').eq('id', id).maybeSingle()
    if (error) throw new InfrastructureError('Gagal mengambil detail BASTB.', error)
    return data ? map(data) : null
  }
  async create(input: BastbInput) {
    const { data, error } = await this.client.from('bastbs').insert({ cluster: input.cluster, no_unit: input.noUnit, bastb_date: input.bastbDate.toISOString().slice(0, 10) }).select('*').single()
    if (error) throw new InfrastructureError('Gagal menyimpan BASTB.', error)
    return map(data)
  }
  async update(id: number, input: BastbInput) {
    const { data, error } = await this.client.from('bastbs').update({ cluster: input.cluster, no_unit: input.noUnit, bastb_date: input.bastbDate.toISOString().slice(0, 10) }).eq('id', id).select('*').maybeSingle()
    if (error) throw new InfrastructureError('Gagal memperbarui BASTB.', error)
    if (!data) throw new NotFoundError('BASTB tidak ditemukan.')
    return map(data)
  }
}
