import { CircleAlert, CircleCheck, Info, X } from 'lucide-react'
import { useToastStore, type ToastTone } from '@/stores/toastStore'
import { cx } from '@/lib/cx'
import { useT } from '@/i18n'
import styles from './Toaster.module.scss'

const icons: Record<ToastTone, typeof Info> = {
  success: CircleCheck,
  error: CircleAlert,
  info: Info,
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)
  const t = useT()

  return (
    <div
      className={styles.region}
      role="region"
      aria-label={t.common.notifications}
      aria-live="polite"
    >
      {toasts.map((item) => {
        const Icon = icons[item.tone]
        return (
          <div key={item.id} className={cx(styles.toast, styles[item.tone])} role="status">
            <Icon className={styles.icon} aria-hidden />
            <div className={styles.text}>
              <p className={styles.title}>{item.title}</p>
              {item.description && <p className={styles.description}>{item.description}</p>}
            </div>
            <button
              className={styles.close}
              onClick={() => dismiss(item.id)}
              aria-label={t.common.dismiss}
            >
              <X />
            </button>
          </div>
        )
      })}
    </div>
  )
}
