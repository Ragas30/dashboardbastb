export type Bastb = {
  id: number
  cluster: string
  noUnit: string
  bastbDate: Date
  createdAt: Date
  updatedAt: Date
}

export type BastbInput = Omit<Bastb, 'id' | 'createdAt' | 'updatedAt'>
