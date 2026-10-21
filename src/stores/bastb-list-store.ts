import { create } from 'zustand'

type BastbListStore = {
  search: string
  setSearch: (search: string) => void
}

export const useBastbListStore = create<BastbListStore>((set) => ({
  search: '',
  setSearch: (search) => set({ search }),
}))
