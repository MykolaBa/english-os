/** Save text as a file (works on desktop and mobile browsers, no server involved). */
export function downloadFile(filename: string, content: string, type: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  // Give the browser a moment to start the download before freeing the blob.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export const MAX_IMPORT_BYTES = 10 * 1024 * 1024

export class FileTooLargeError extends Error {}

export async function readTextFile(file: File): Promise<string> {
  if (file.size > MAX_IMPORT_BYTES) throw new FileTooLargeError(file.name)
  return file.text()
}

/** "englishos-backup-2026-11-19.json" */
export function datedFilename(base: string, ext: string, date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${base}-${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}.${ext}`
}
