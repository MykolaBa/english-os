import { ListChecks } from 'lucide-react'
import type { PhraseSet } from '@/content/it'
import { useT } from '@/i18n'
import { newSeed } from '@/lib/exercises/random'
import { PracticeSection } from '@/features/exercises/PracticeSection'
import { buildPhraseDrill } from '../drill'
import { recordPhrasePractice } from '../itRepo'

/** A practice round for one phrase set; every start shuffles a new round. */
export function PhrasePractice({
  set,
  onRunningChange,
}: {
  set: PhraseSet
  /** The page hides its phrase list (the answers) while a round runs. */
  onRunningChange: (running: boolean) => void
}) {
  const s = useT().itEnglish
  return (
    <PracticeSection
      title={s.practise}
      intro={<p>{s.practiseText(set.phrases.length)}</p>}
      startLabel={s.practise}
      startIcon={<ListChecks />}
      build={() => buildPhraseDrill(set, newSeed())}
      onComplete={(result) => recordPhrasePractice(set.id, set.title, result)}
      onRunningChange={onRunningChange}
    />
  )
}
