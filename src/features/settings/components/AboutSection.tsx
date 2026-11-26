import { useState } from 'react'
import { Info } from 'lucide-react'
import { Button, Card, CardHeader, ConfirmDialog } from '@/components/ui'
import { useT } from '@/i18n'
import { useSettings } from '@/stores/settingsStore'
import { toast } from '@/stores/toastStore'
import styles from '../Settings.module.scss'

export function AboutSection() {
  const s = useT().settings
  const reset = useSettings((st) => st.reset)
  const [confirmReset, setConfirmReset] = useState(false)
  return (
    <Card>
      <CardHeader icon={<Info />} title={s.about} />
      <dl className={styles.facts}>
        <div>
          <dt>{s.version}</dt>
          <dd>{__APP_VERSION__}</dd>
        </div>
        <div>
          <dt>{s.mode}</dt>
          <dd>{s.modeValue}</dd>
        </div>
      </dl>
      <div className={styles.resetRow}>
        <Button variant="ghost" size="sm" onClick={() => setConfirmReset(true)}>
          {s.reset}
        </Button>
      </div>
      <ConfirmDialog
        open={confirmReset}
        title={s.resetTitle}
        description={s.resetText}
        confirmLabel={s.resetConfirm}
        danger
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          reset()
          setConfirmReset(false)
          toast.success(s.resetDone)
        }}
      />
    </Card>
  )
}
