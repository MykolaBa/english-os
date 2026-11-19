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

export function speak(text: string, rate = 0.95): void {
  if (!isSpeechSupported()) return
  const synth = window.speechSynthesis
  synth.cancel() // stop anything still playing
  const utterance = new SpeechSynthesisUtterance(text)
  const voice = pickVoice()
  if (voice) utterance.voice = voice
  utterance.lang = voice?.lang ?? 'en-GB'
  utterance.rate = rate
  synth.speak(utterance)
}
