import { PageHeader } from '@/components/ui'
import { useT } from '@/i18n'
import { AboutSection } from './components/AboutSection'
import { AppearanceSection } from './components/AppearanceSection'
import { DataSection } from './components/DataSection'
import { ProfileSection } from './components/ProfileSection'
import { GoalSection, ReviewSection } from './components/StudySections'
import styles from './Settings.module.scss'

/** Each section reads only its own settings, so changing one doesn't re-render the rest. */
export default function SettingsPage() {
  const s = useT().settings
  return (
    <>
      <PageHeader title={s.title} description={s.subtitle} />
      <div className={styles.grid}>
        <AppearanceSection />
        <ProfileSection />
        <GoalSection />
        <ReviewSection />
        <DataSection />
        <AboutSection />
      </div>
    </>
  )
}
