import { normalizeTerm } from './model'

/** Stable ids of shipped content: tiny, so any feature can import them cheaply. */

const slug = (text: string) =>
  normalizeTerm(text)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export const seedCollectionId = (s: string) => `seed:collection:${s}`
export const seedWordId = (term: string) => `seed:word:${slug(term)}`
