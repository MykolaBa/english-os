import type { Phrase, PhraseSet } from '@/content/it'
import { createRng, shuffleWith } from '@/lib/exercises/random'
import type { ChoiceExercise, GapExercise } from '@/lib/exercises/types'

const OPTIONS = 4

export type DrillExercise = ChoiceExercise | GapExercise

/** The word worth recalling: the longest one (4+ letters), e.g. "reproduce", "estimate". */
export function keyWordOf(sentence: string): string | null {
  const words = sentence.match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g) ?? []
  const best = words.reduce<string | null>(
    (top, w) => (w.length >= 4 && w.length > (top?.length ?? 0) ? w : top),
    null,
  )
  return best
}

function choice(
  set: PhraseSet,
  phrase: Phrase,
  index: number,
  random: () => number,
): ChoiceExercise {
  const others = set.phrases.filter((p) => p !== phrase).map((p) => p.en)
  const options = shuffleWith(
    [phrase.en, ...shuffleWith(others, random).slice(0, OPTIONS - 1)],
    random,
  )
  return {
    id: `it:${set.id}:${index}:choice`,
    type: 'choice',
    prompt: phrase.uk,
    promptLang: 'uk',
    options,
    answer: options.indexOf(phrase.en),
    explanation: phrase.note ?? `«${phrase.en}» — ${phrase.uk}`,
  }
}

export function gap(set: PhraseSet, phrase: Phrase, index: number, word: string): GapExercise {
  const pattern = new RegExp(`\\b${word}\\b`)
  return {
    id: `it:${set.id}:${index}:gap`,
    type: 'gap',
    prompt: phrase.en.replace(pattern, '___'),
    answers: [word],
    translation: phrase.uk,
    explanation: phrase.note ?? `«${phrase.en}» — ${phrase.uk}`,
  }
}

/**
 * A practice round for one phrase set, mixing two skills: recognising a phrase from its
 * Ukrainian meaning (choice, distractors from the same situation) and recalling its key
 * word (typing). Seeded, so the same seed gives the same round.
 */
export function buildPhraseDrill(set: PhraseSet, seed: string): DrillExercise[] {
  const random = createRng(`${set.id}:${seed}`)
  return shuffleWith(
    set.phrases.map((phrase, index) => ({ phrase, index })),
    random,
  ).map(({ phrase, index }, position) => {
    const word = keyWordOf(phrase.en)
    return position % 2 === 1 && word
      ? gap(set, phrase, index, word)
      : choice(set, phrase, index, random)
  })
}
