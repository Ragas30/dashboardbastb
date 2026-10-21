'use client'

import { useEffect } from 'react'
import { useToastStore } from '@/stores/toast-store'

export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts)
  const remove = useToastStore((state) => state.remove)
  useEffect(() => { const timers = toasts.map((toast) => setTimeout(() => remove(toast.id), 3500)); return () => timers.forEach(clearTimeout) }, [toasts, remove])
  return <div className="fixed right-4 top-4 z-[100] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2">{toasts.map((toast) => <div key={toast.id} role="status" className={`rounded-lg border px-4 py-3 text-sm font-medium shadow-lg ${toast.tone === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>{toast.message}</div>)}</div>
}
