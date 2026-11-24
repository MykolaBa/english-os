import { useEffect, useRef } from 'react'
import { ListChecks } from 'lucide-react'
import { Button } from '@/components/ui'
import type { PhraseSet } from '@/content/it'
import { useT } from '@/i18n'
import { newSeed } from '@/lib/exercises/random'
import { toast } from '@/stores/toastStore'
import { ExerciseRunner } from '@/features/exercises/ExerciseRunner'
import { buildPhraseDrill, type DrillExercise } from '../drill'
import { recordPhrasePractice } from '../itRepo'
import styles from '../ItEnglish.module.scss'

interface PhrasePracticeProps {
  set: PhraseSet
  drill: DrillExercise[] | null
  onDrillChange: (drill: DrillExercise[] | null) => void
}

/**
 * A practice round on the shared exercise engine; each start shuffles a new round.
 * The page owns the round, so it can hide the phrase list (the answers) while it runs.
 */
export function PhrasePractice({ set, drill, onDrillChange: setDrill }: PhrasePracticeProps) {
  const t = useT()
  const s = t.itEnglish
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (drill) ref.current?.scrollIntoView({ block: 'start' })
  }, [drill])

  return (
    <section ref={ref} className={styles.panel} aria-labelledby="practice-title">
      <h2 id="practice-title" className={styles.sectionTitle}>
        {s.practise}
      </h2>
      {drill ? (
        <ExerciseRunner
          exercises={drill}
          onComplete={(result) =>
            void recordPhrasePractice(set.id, set.title, result).catch((err) =>
              toast.error(t.errors.title, String(err)),
            )
          }
          onClose={() => setDrill(null)}
        />
      ) : (
        <>
          <p className={styles.muted}>{s.practiseText(set.phrases.length)}</p>
          <Button
            variant="primary"
            icon={<ListChecks />}
            onClick={() => setDrill(buildPhraseDrill(set, newSeed()))}
          >
            {s.practise}
          </Button>
        </>
      )}
    </section>
  )
}
