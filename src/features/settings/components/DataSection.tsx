import { useEffect, useState } from 'react'
import { Database } from 'lucide-react'
import { Badge, Button, Card, CardHeader } from '@/components/ui'
import { useT } from '@/i18n'
import {
  formatBytes,
  getStorageInfo,
  requestPersistentStorage,
  type StorageInfo,
} from '@/lib/storage/persistence'
import { toast } from '@/stores/toastStore'
import { BackupSection } from './BackupSection'
import styles from '../Settings.module.scss'

export function DataSection() {
  const s = useT().settings
  const [storage, setStorage] = useState<StorageInfo | null>(null)

  // Reading the browser's storage estimate is a side effect, hence the effect.
  useEffect(() => {
    let alive = true
    void getStorageInfo().then((info) => alive && setStorage(info))
    return () => {
      alive = false
    }
  }, [])

  const askPersistence = async () => {
    const granted = await requestPersistentStorage()
    setStorage(await getStorageInfo())
    if (granted) toast.success(s.protectedToast)
    else toast.info(s.declinedToast, s.declinedText)
  }

  return (
    <Card>
      <CardHeader icon={<Database />} title={s.data} description={s.dataDescription} />
      <dl className={styles.facts}>
        <div>
          <dt>{s.persistent}</dt>
          <dd>
            {storage?.persisted ? (
              <Badge tone="success">{s.protected}</Badge>
            ) : (
              <Button size="sm" onClick={askPersistence}>
                {s.protect}
              </Button>
            )}
          </dd>
        </div>
        <div>
          <dt>{s.used}</dt>
          <dd>{storage?.usageBytes !== undefined ? formatBytes(storage.usageBytes) : s.unknown}</dd>
        </div>
      </dl>
      <BackupSection />
    </Card>
  )
}
