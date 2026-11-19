import { CircleAlert, CircleCheck, Info, X } from 'lucide-react'
import { useToastStore, type ToastTone } from '@/stores/toastStore'
import { cx } from '@/lib/cx'
import styles from './Toaster.module.scss'

const icons: Record<ToastTone, typeof Info> = {
  success: CircleCheck,
  error: CircleAlert,
  info: Info,
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  return (
    <div className={styles.region} role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map((t) => {
        const Icon = icons[t.tone]
        return (
          <div key={t.id} className={cx(styles.toast, styles[t.tone])} role="status">
            <Icon className={styles.icon} aria-hidden />
            <div className={styles.text}>
              <p className={styles.title}>{t.title}</p>
              {t.description && <p className={styles.description}>{t.description}</p>}
            </div>
            <button className={styles.close} onClick={() => dismiss(t.id)} aria-label="Dismiss">
              <X />
            </button>
          </div>
        )
      })}
    </div>
  )
}
