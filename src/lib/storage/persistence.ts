/**
 * Browsers may evict IndexedDB data under storage pressure (Safari is aggressive).
 * Asking for persistent storage makes eviction much less likely. Backups (phase 4)
 * remain the real safety net.
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (!navigator.storage?.persist) return false
  if (await navigator.storage.persisted()) return true
  return navigator.storage.persist()
}

export interface StorageInfo {
  persisted: boolean
  usageBytes?: number
  quotaBytes?: number
}

export async function getStorageInfo(): Promise<StorageInfo> {
  const persisted = (await navigator.storage?.persisted?.()) ?? false
  const estimate = await navigator.storage?.estimate?.()
  return { persisted, usageBytes: estimate?.usage, quotaBytes: estimate?.quota }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`
}
