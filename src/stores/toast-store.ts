import { create } from 'zustand'

type Toast = { id: number; message: string; tone: 'success' | 'error' }
type ToastStore = { toasts: Toast[]; add: (message: string, tone?: Toast['tone']) => void; remove: (id: number) => void }

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (message, tone = 'success') => set((state) => ({ toasts: [...state.toasts, { id: Date.now() + Math.random(), message, tone }] })),
  remove: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}))
