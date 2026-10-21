import { create } from 'zustand'

type BastbListStore = {
  search: string
  page: number
  setSearch: (search: string) => void
  setPage: (page: number) => void
}

export const useBastbListStore = create<BastbListStore>((set) => ({
  search: '',
  page: 1,
  setSearch: (search) => set({ search, page: 1 }),
  setPage: (page) => set({ page }),
}))
