import { create } from 'zustand'

type DefectListStore = {
  search: string
  page: number
  setSearch: (search: string) => void
  setPage: (page: number) => void
}

export const useDefectListStore = create<DefectListStore>((set) => ({
  search: '',
  page: 1,
  setSearch: (search) => set({ search, page: 1 }),
  setPage: (page) => set({ page }),
}))
