/**
 * Pronunciation via the browser's built-in Web Speech API — free, offline on most devices,
 * no API keys. Voice quality depends on the OS (iOS/macOS and Android sound good).
 */

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

function pickVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find((v) => v.lang === 'en-GB' && v.localService) ??
    voices.find((v) => v.lang === 'en-US' && v.localService) ??
    voices.find((v) => v.lang.startsWith('en'))
  )
}

/** Speaks English text. `onEnd` fires when it finishes or is stopped. */
export function speak(text: string, rate = 0.95, onEnd?: () => void): void {
  if (!isSpeechSupported()) return
  const synth = window.speechSynthesis
  synth.cancel() // stop anything still playing
  const utterance = new SpeechSynthesisUtterance(text)
  const voice = pickVoice()
  if (voice) utterance.voice = voice
  utterance.lang = voice?.lang ?? 'en-GB'
  utterance.rate = rate
  if (onEnd) {
    utterance.onend = onEnd
    utterance.onerror = onEnd
  }
  synth.speak(utterance)
}

export function stopSpeaking(): void {
  if (isSpeechSupported()) window.speechSynthesis.cancel()
}

/** The parts of a voice the voice choice needs (SpeechSynthesisVoice satisfies it). */
export interface VoiceInfo {
  name: string
  lang: string
  localService: boolean
}

export interface CastMember<V extends VoiceInfo> {
  voice?: V
  /** When only one voice exists, a slightly higher pitch tells the second speaker apart. */
  pitch: number
}

/**
 * Casts a dialogue: two different English voices for speakers A and B (local ones first,
 * British before American), the first one for a narrator. Pure, so it can be tested.
 */
export function castVoices<V extends VoiceInfo>(
  voices: readonly V[],
): Record<'A' | 'B' | 'N', CastMember<V>> {
  const english = voices
    .filter((v) => v.lang.toLowerCase().startsWith('en'))
    .toSorted(
      (a, b) =>
        Number(b.localService) - Number(a.localService) ||
        Number(b.lang === 'en-GB') - Number(a.lang === 'en-GB'),
    )
  const first = english[0]
  const second = english.find((v) => v.name !== first?.name)
  return {
    A: { voice: first, pitch: 1 },
    B: second ? { voice: second, pitch: 1 } : { voice: first, pitch: 1.25 },
    N: { voice: first, pitch: 1 },
  }
}

/**
 * Speaks one line and resolves when it's over: true when it played to the end, false
 * when it was cancelled or failed. Used to play a script line by line.
 */
export function speakLine(
  text: string,
  options: { rate: number; pitch?: number; voice?: SpeechSynthesisVoice },
): Promise<boolean> {
  if (!isSpeechSupported()) return Promise.resolve(false)
  const utterance = new SpeechSynthesisUtterance(text)
  if (options.voice) utterance.voice = options.voice
  utterance.lang = options.voice?.lang ?? 'en-GB'
  utterance.rate = options.rate
  utterance.pitch = options.pitch ?? 1
  // Some browsers drop events of utterances that get garbage-collected: keep it referenced.
  pending.add(utterance)
  return new Promise<boolean>((resolve) => {
    utterance.onend = () => resolve(true)
    utterance.onerror = () => resolve(false)
    window.speechSynthesis.speak(utterance)
  }).finally(() => pending.delete(utterance))
}

const pending = new Set<SpeechSynthesisUtterance>()

/** The browser's voices once they're loaded (Chrome loads them asynchronously). */
export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!isSpeechSupported()) return Promise.resolve([])
  const now = window.speechSynthesis.getVoices()
  if (now.length > 0) return Promise.resolve(now)
  return new Promise((resolve) => {
    const done = () => resolve(window.speechSynthesis.getVoices())
    window.speechSynthesis.addEventListener('voiceschanged', done, { once: true })
    // Some systems have no voices at all and never fire the event.
    window.setTimeout(done, 1500)
  })
}
