/**
 * Exercise model shared by grammar lessons and (later) quizzes.
 * A discriminated union on `type`: each variant carries exactly the data it needs,
 * and `switch (exercise.type)` narrows it — TypeScript checks every case is handled.
 * Prompts are English; `explanation` / `instruction` are Ukrainian.
 */

/** Prompts and options are English unless marked; generated quiz questions may be Ukrainian. */
export type ContentLang = 'en' | 'uk'

interface Base {
  id: string
  /** Language of the prompt text (default English). */
  promptLang?: ContentLang
  /** Why the answer is right (Ukrainian), shown after checking. */
  explanation: string
}

/** Pick one option. */
export interface ChoiceExercise extends Base {
  type: 'choice'
  prompt: string
  options: string[]
  /** Language of the options (default English). */
  optionsLang?: ContentLang
  /** Index into `options`. */
  answer: number
}

/** Fill the gap (`___`) in a sentence; a hint like "(work)" may follow. */
export interface GapExercise extends Base {
  type: 'gap'
  prompt: string
  /** Accepted answers for the gap (contractions are matched automatically). */
  answers: string[]
}

/** Rewrite a sentence following an instruction. */
export interface TransformExercise extends Base {
  type: 'transform'
  instruction: string
  prompt: string
  answers: string[]
}

/** Put the words in the right order. */
export interface OrderExercise extends Base {
  type: 'order'
  tokens: string[]
  answers: string[]
  /** Ukrainian meaning of the sentence, as a hint. */
  translation?: string
}

export type Exercise = ChoiceExercise | GapExercise | TransformExercise | OrderExercise
export type ExerciseType = Exercise['type']

/** What the learner gave: an option index for `choice`, text for everything else. */
export type ExerciseResponse = number | string
