import { InfrastructureError, NotFoundError } from '@/lib/errors'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { PicRepository } from '../application/pic-repository'
import type { Pic, PicInput } from '../types/pic-types'

function mapPic(row: any): Pic {
  return { id: row.id, name: row.name, status: row.status, createdAt: new Date(row.created_at), updatedAt: new Date(row.updated_at) }
}

export class SupabasePicRepository implements PicRepository {
  constructor(private readonly client: SupabaseClient) {}

  async list() {
    const { data, error } = await this.client.from('master_pics').select('*').order('name')
    if (error) throw new InfrastructureError('Gagal mengambil data PIC.', error)
    return (data ?? []).map(mapPic)
  }

  async findById(id: number) {
    const { data, error } = await this.client.from('master_pics').select('*').eq('id', id).maybeSingle()
    if (error) throw new InfrastructureError('Gagal mengambil detail PIC.', error)
    return data ? mapPic(data) : null
  }

  async create(input: PicInput) {
    const { data, error } = await this.client.from('master_pics').insert({ name: input.name, status: input.status }).select('*').single()
    if (error) throw new InfrastructureError('Gagal menyimpan PIC.', error)
    return mapPic(data)
  }

  async update(id: number, input: PicInput) {
    const { data, error } = await this.client.from('master_pics').update({ name: input.name, status: input.status }).eq('id', id).select('*').maybeSingle()
    if (error) throw new InfrastructureError('Gagal memperbarui PIC.', error)
    if (!data) throw new NotFoundError('PIC tidak ditemukan.')
    return mapPic(data)
  }
}
