import { BookOpen, BrainCircuit, Code, Repeat, Zap } from 'lucide-react'
import { Link } from 'react-router'
import { Card, CardHeader } from '@/components/ui'
import { useT } from '@/i18n'
import styles from '../Dashboard.module.scss'

const ACTIONS = [
  { to: '/vocabulary?add=1', key: 'addWord', icon: BookOpen },
  { to: '/review', key: 'review', icon: Repeat },
  { to: '/grammar', key: 'grammar', icon: BrainCircuit },
  { to: '/it-english', key: 'interview', icon: Code },
] as const

export function QuickActions() {
  const t = useT().dashboard.quick
  return (
    <Card>
      <CardHeader icon={<Zap />} title={t.title} />
      <div className={styles.quick}>
        {ACTIONS.map(({ to, key, icon: Icon }) => (
          <Link key={key} to={to} className={styles.quickItem}>
            <Icon aria-hidden />
            <span>{t[key]}</span>
          </Link>
        ))}
      </div>
    </Card>
  )
}
