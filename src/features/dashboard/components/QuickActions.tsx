import { BookOpen, BrainCircuit, Code, Repeat, Zap } from 'lucide-react'
import { Link } from 'react-router'
import { Card, CardHeader } from '@/components/ui'
import styles from '../Dashboard.module.scss'

const ACTIONS = [
  { to: '/vocabulary', label: 'Add a word', icon: BookOpen },
  { to: '/review', label: 'Review cards', icon: Repeat },
  { to: '/grammar', label: 'Grammar lesson', icon: BrainCircuit },
  { to: '/it-english', label: 'IT interview', icon: Code },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader icon={<Zap />} title="Quick actions" />
      <div className={styles.quick}>
        {ACTIONS.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className={styles.quickItem}>
            <Icon aria-hidden />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </Card>
  )
}
