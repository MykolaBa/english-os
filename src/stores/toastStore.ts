import { create } from 'zustand'
import { createId } from '@/lib/id'

export type ToastTone = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  tone: ToastTone
  title: string
  description?: string
}

interface ToastState {
  toasts: Toast[]
  push: (toast: Omit<Toast, 'id'>, durationMs?: number) => string
  dismiss: (id: string) => void
}

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  push: (toast, durationMs = 3500) => {
    const id = createId()
    set({ toasts: [...get().toasts.slice(-3), { ...toast, id }] })
    window.setTimeout(() => get().dismiss(id), durationMs)
    return id
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}))

/** Call from anywhere (components, services): `toast.success('Saved')`. */
export const toast = {
  success: (title: string, description?: string) =>
    useToastStore.getState().push({ tone: 'success', title, description }),
  error: (title: string, description?: string) =>
    useToastStore.getState().push({ tone: 'error', title, description }, 6000),
  info: (title: string, description?: string) =>
    useToastStore.getState().push({ tone: 'info', title, description }),
}
