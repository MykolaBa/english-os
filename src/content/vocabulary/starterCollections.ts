/**
 * Starter collections: small metadata, kept apart from the word list so the app can show
 * and order collections without loading 100+ words. See starterWords.ts for the words.
 */

export const STARTER_VOCABULARY_VERSION = 1

export interface StarterCollection {
  slug: string
  name: string
  description: string
  icon: string
}

export const STARTER_COLLECTIONS: StarterCollection[] = [
  { slug: 'everyday', name: 'Everyday English', description: 'Words for daily life and small talk', icon: 'coffee' },
  { slug: 'common-verbs', name: 'Common Verbs', description: 'High-frequency verbs worth knowing well', icon: 'zap' },
  { slug: 'phrasal-verbs', name: 'Phrasal Verbs', description: 'Verb + particle combinations natives use constantly', icon: 'shuffle' },
  { slug: 'it', name: 'IT & Programming', description: 'Words from code reviews, standups and docs', icon: 'code' },
  { slug: 'work', name: 'Professional Communication', description: 'Emails, meetings and teamwork', icon: 'briefcase' },
  { slug: 'interviews', name: 'Job Interviews', description: 'Talking about yourself and your experience', icon: 'user-check' },
  { slug: 'travel', name: 'Travel', description: 'Airports, hotels and getting around', icon: 'plane' },
  { slug: 'idioms', name: 'Idioms', description: 'Expressions whose meaning isn’t literal', icon: 'sparkles' },
  { slug: 'difficult', name: 'Difficult Words', description: 'Words you want to give extra attention', icon: 'flame' },
  { slug: 'mistakes', name: 'My Mistakes', description: 'Words you got wrong in reviews and quizzes', icon: 'circle-alert' },
]
