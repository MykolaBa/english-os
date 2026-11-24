import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
import { useT } from '@/i18n'
import styles from '../ItEnglish.module.scss'

export function BackLink() {
  const s = useT().itEnglish
  return (
    <Link to="/it-english" className={styles.backLink}>
      <ArrowLeft aria-hidden /> {s.back}
    </Link>
  )
}
