import { Volume2 } from 'lucide-react'
import { Button } from './Button'
import { useT } from '@/i18n'
import { isSpeechSupported, speak } from '@/lib/speech'

export function SpeakButton({ text, size = 'sm' }: { text: string; size?: 'sm' | 'md' }) {
  const t = useT()
  if (!isSpeechSupported()) return null
  return (
    <Button
      variant="ghost"
      size={size}
      iconOnly
      icon={<Volume2 />}
      aria-label={`${t.vocabulary.pronounce}: ${text}`}
      title={t.vocabulary.pronounce}
      onClick={(e) => {
        e.preventDefault() // the button often sits inside a link card
        e.stopPropagation()
        speak(text)
      }}
    />
  )
}
