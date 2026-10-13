export const PIC_STATUSES = ['ACTIVE', 'INACTIVE'] as const

export type PicStatus = (typeof PIC_STATUSES)[number]
