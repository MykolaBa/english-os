import type { ListeningEpisode } from '@/content/listening'
import type { Exercise, GapExercise } from '@/lib/exercises/types'

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** The line with its dictation word blanked out (whole word, first match only). */
export function blankWord(line: string, word: string): string {
  return line.replace(new RegExp(`(?<![\\w'’])${escape(word)}(?![\\w'’])`), '___')
}

/**
 * Dictation: hear the line, type the missing word. The full line is the exercise's
 * audio; the Ukrainian translation is the hint.
 */
export function dictationExercises(episode: ListeningEpisode): GapExercise[] {
  return episode.dictation.flatMap((item) => {
    const line = episode.lines[item.line]
    if (!line) return []
    return [
      {
        id: item.id,
        type: 'gap' as const,
        prompt: blankWord(line.en, item.word),
        answers: [item.word],
        translation: line.uk,
        audio: line.en,
        explanation: `«${line.en}»`,
      },
    ]
  })
}

/** The whole check after listening: catch words by ear first, then answer questions. */
export const episodeExercises = (episode: ListeningEpisode): Exercise[] => [
  ...dictationExercises(episode),
  ...episode.questions,
]
