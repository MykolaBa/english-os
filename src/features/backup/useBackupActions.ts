import { useLiveQuery } from 'dexie-react-hooks'
import { useT } from '@/i18n'
import { datedFilename, downloadFile } from '@/lib/files'
import { toast } from '@/stores/toastStore'
import { createBackup, getLastBackupAt, markBackupMade } from './backup'

/** Shared by Settings and any reminder: download a backup and know when the last one was. */
export function useBackupActions() {
  const t = useT().backup
  const lastBackupAt = useLiveQuery(getLastBackupAt, [])

  const downloadBackup = async () => {
    const backup = await createBackup()
    downloadFile(
      datedFilename('englishos-backup', 'json'),
      JSON.stringify(backup),
      'application/json',
    )
    await markBackupMade()
    toast.success(t.exported)
  }

  return { lastBackupAt, downloadBackup }
}
