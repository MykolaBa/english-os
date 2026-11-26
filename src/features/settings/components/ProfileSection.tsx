import { User } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import { Card, CardHeader, SelectField, TextField } from '@/components/ui'
import { useT } from '@/i18n'
import { CEFR_LEVELS } from '@/lib/db/types'
import { useSettings } from '@/stores/settingsStore'
import styles from '../Settings.module.scss'

const LEVEL_OPTIONS = CEFR_LEVELS.map((l) => ({ value: l, label: l }))

export function ProfileSection() {
  const s = useT().settings
  const { displayName, currentLevel, targetLevel, update } = useSettings(
    useShallow((st) => ({
      displayName: st.displayName,
      currentLevel: st.currentLevel,
      targetLevel: st.targetLevel,
      update: st.update,
    })),
  )
  return (
    <Card>
      <CardHeader icon={<User />} title={s.profile} />
      <div className={styles.fields}>
        <TextField
          label={s.name}
          placeholder={s.namePlaceholder}
          value={displayName}
          maxLength={40}
          onChange={(e) => update({ displayName: e.target.value })}
        />
        <div className={styles.row}>
          <SelectField
            label={s.currentLevel}
            options={LEVEL_OPTIONS}
            value={currentLevel}
            onChange={(v) => update({ currentLevel: v })}
          />
          <SelectField
            label={s.targetLevel}
            options={LEVEL_OPTIONS}
            value={targetLevel}
            onChange={(v) => update({ targetLevel: v })}
          />
        </div>
      </div>
    </Card>
  )
}
